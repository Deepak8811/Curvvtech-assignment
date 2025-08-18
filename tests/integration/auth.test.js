const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user.model');

describe('Auth Routes', () => {
    const userData = {
        email: 'test@example.com',
        password: 'Password123!',
    };

    it('should sign up a new user and return tokens', async () => {
        const res = await request(app)
            .post('/v1/auth/signup')
            .send(userData)
            .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe(userData.email);
        expect(res.body.tokens).toBeDefined();
        expect(res.body.tokens.access).toBeDefined();
        expect(res.body.tokens.refresh).toBeDefined();

        const dbUser = await User.findOne({ email: userData.email });
        expect(dbUser).toBeDefined();
    });

    it('should log in an existing user and return tokens', async () => {
        // First, create the user
        await request(app).post('/v1/auth/signup').send(userData);

        const res = await request(app)
            .post('/v1/auth/login')
            .send(userData)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(res.body.tokens).toBeDefined();
    });

    it('should return 401 for incorrect password', async () => {
        await request(app).post('/v1/auth/signup').send(userData);

        await request(app)
            .post('/v1/auth/login')
            .send({ email: userData.email, password: 'wrongpassword' })
            .expect(401);
    });
});
