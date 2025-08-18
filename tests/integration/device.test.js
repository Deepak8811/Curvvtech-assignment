const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user.model');
const Device = require('../../src/models/device.model');

describe('Device Routes', () => {
    let token;
    let userId;

    beforeEach(async () => {
        // Create a user and get a token
        await request(app)
            .post('/v1/auth/signup')
            .send({ name: 'Device Test User', email: 'device-test@example.com', password: 'Password123!' });

        const loginRes = await request(app)
            .post('/v1/auth/login')
            .send({ email: 'device-test@example.com', password: 'Password123!' });

        token = loginRes.body.token;
        userId = loginRes.body.user.id;
    });

    it('should create a device for an authenticated user', async () => {
        const res = await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'My Test Device', type: 'light' })
            .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.device).toBeDefined();
        expect(res.body.device.name).toBe('My Test Device');

        const dbDevice = await Device.findById(res.body.device.id);
        expect(dbDevice).toBeDefined();
        expect(dbDevice.ownerId.toString()).toBe(userId);
    });

    it('should not create a device for an unauthenticated user', async () => {
        await request(app)
            .post('/v1/devices')
            .send({ name: 'Unauthorized Device', type: 'sensor' })
            .expect(401);
    });

    it('should get all devices for an authenticated user', async () => {
        // Create a device first
        await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Device 1', type: 'sensor' });

        const res = await request(app)
            .get('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.devices).toBeInstanceOf(Array);
        expect(res.body.devices.length).toBe(1);
        expect(res.body.devices[0].name).toBe('Device 1');
    });

    it('should get a single device by id', async () => {
        const deviceRes = await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Device To Fetch', type: 'actuator' });

        const deviceId = deviceRes.body.device.id;

        const res = await request(app)
            .get(`/v1/devices/${deviceId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.device.name).toBe('Device To Fetch');
    });

    it('should not get a device belonging to another user', async () => {
        const deviceRes = await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Another User Device', type: 'actuator' });
        const deviceId = deviceRes.body.device.id;

        // Create a second user and token
        await request(app)
            .post('/v1/auth/signup')
            .send({ name: 'Another User', email: 'another@example.com', password: 'Password123!' });

        const anotherLoginRes = await request(app)
            .post('/v1/auth/login')
            .send({ email: 'another@example.com', password: 'Password123!' });

        const anotherToken = anotherLoginRes.body.token;

        await request(app)
            .get(`/v1/devices/${deviceId}`)
            .set('Authorization', `Bearer ${anotherToken}`)
            .expect(404);
    });

    it('should update a device', async () => {
        const deviceRes = await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Device to Update', type: 'sensor' });
        const deviceId = deviceRes.body.device.id;

        const res = await request(app)
            .patch(`/v1/devices/${deviceId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated Device Name' })
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.device.name).toBe('Updated Device Name');
    });

    it('should delete a device', async () => {
        const deviceRes = await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Device to Delete', type: 'sensor' });
        const deviceId = deviceRes.body.device.id;

        await request(app)
            .delete(`/v1/devices/${deviceId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const dbDevice = await Device.findById(deviceId);
        expect(dbDevice).toBeNull();
    });

    it('should update a device heartbeat', async () => {
        const deviceRes = await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Heartbeat Device', type: 'sensor' });
        const deviceId = deviceRes.body.device.id;

        const res = await request(app)
            .post(`/v1/devices/${deviceId}/heartbeat`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Device heartbeat recorded');
        expect(res.body.last_active_at).toBeDefined();
    });

    it('should create a log for a device', async () => {
        const deviceRes = await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Log Device', type: 'sensor' });
        const deviceId = deviceRes.body.device.id;

        const res = await request(app)
            .post(`/v1/devices/${deviceId}/logs`)
            .set('Authorization', `Bearer ${token}`)
            .send({ event: 'units_consumed', value: 10 })
            .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.log).toBeDefined();
        expect(res.body.log.event).toBe('units_consumed');
    });

    it('should get usage analytics for a device', async () => {
        const deviceRes = await request(app)
            .post('/v1/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Analytics Device', type: 'sensor' });
        const deviceId = deviceRes.body.device.id;

        // Create some logs
        await request(app)
            .post(`/v1/devices/${deviceId}/logs`)
            .set('Authorization', `Bearer ${token}`)
            .send({ event: 'units_consumed', value: 15 });
        await request(app)
            .post(`/v1/devices/${deviceId}/logs`)
            .set('Authorization', `Bearer ${token}`)
            .send({ event: 'units_consumed', value: 5 });

        const res = await request(app)
            .get(`/v1/devices/${deviceId}/usage?range=24h`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.usage).toBeDefined();
        expect(res.body.usage.total_usage).toBe(20);
    });
});
