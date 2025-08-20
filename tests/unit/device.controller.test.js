import { jest } from '@jest/globals';
import deviceController from '../../src/api/controllers/device.controller.js';
import deviceService from '../../src/services/device.service.js';

// Mock the service with proper jest.fn() mocks
const mockDeviceService = {
  createDevice: jest.fn(),
  queryDevices: jest.fn(),
  getDeviceById: jest.fn(),
  updateDeviceById: jest.fn(),
  deleteDeviceById: jest.fn(),
  updateDeviceHeartbeat: jest.fn()
};

jest.mock('../../src/services/device.service.js', () => mockDeviceService);


describe('Device Controller Unit Tests', () => {
    let mockReq, mockRes;
    const mockUser = { id: 'user123' };
    const mockDevice = {
        id: 'device123',
        name: 'Test Device',
        userId: 'user123',
        lastActiveAt: new Date(),
        toJSON() {
            return { ...this, lastActiveAt: this.lastActiveAt.toISOString() };
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            params: {},
            body: {},
            query: {},
            user: { ...mockUser }
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createDevice', () => {
        it('should create a new device successfully', async () => {
            mockReq.body = { name: 'Test Device', type: 'sensor' };
            mockDeviceService.createDevice.mockResolvedValue(mockDevice);

            await deviceController.createDevice(mockReq, mockRes);

            expect(deviceService.createDevice).toHaveBeenCalledWith(mockReq.body, mockUser.id);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, device: mockDevice });
        });

        it('should handle errors when creating a device', async () => {
            const error = new Error('Creation failed');
            mockDeviceService.createDevice.mockRejectedValue(error);

            await deviceController.createDevice(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Creation failed' });
        });
    });

    describe('getDevices', () => {
        it('should return a list of devices', async () => {
            const mockDevices = [mockDevice];
            mockDeviceService.queryDevices.mockResolvedValue(mockDevices);

            await deviceController.getDevices(mockReq, mockRes);

            expect(deviceService.queryDevices).toHaveBeenCalledWith(mockReq.query, mockUser.id);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, devices: mockDevices });
        });

        it('should handle errors when fetching devices', async () => {
            const error = new Error('Fetch failed');
            mockDeviceService.queryDevices.mockRejectedValue(error);

            await deviceController.getDevices(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Fetch failed' });
        });
    });

    describe('getDevice', () => {
        it('should return a device by id', async () => {
            mockReq.params.id = 'device123';
            mockDeviceService.getDeviceById.mockResolvedValue(mockDevice);

            await deviceController.getDevice(mockReq, mockRes);

            expect(deviceService.getDeviceById).toHaveBeenCalledWith('device123', mockUser.id);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, device: mockDevice });
        });

        it('should return 404 if device not found', async () => {
            mockReq.params.id = 'non-existent';
            mockDeviceService.getDeviceById.mockResolvedValue(null);

            await deviceController.getDevice(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Device not found' });
        });
    });

    describe('updateDevice', () => {
        it('should update a device successfully', async () => {
            mockReq.params.id = 'device123';
            mockReq.body = { name: 'Updated Device' };
            mockDeviceService.updateDeviceById.mockResolvedValue(mockDevice);

            await deviceController.updateDevice(mockReq, mockRes);

            expect(deviceService.updateDeviceById).toHaveBeenCalledWith('device123', mockReq.body, mockUser.id);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, device: mockDevice });
        });

        it('should handle errors when updating a device', async () => {
            const error = new Error('Device not found');
            mockReq.params.id = 'non-existent';
            mockDeviceService.updateDeviceById.mockRejectedValue(error);

            await deviceController.updateDevice(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Device not found' });
        });
    });

    describe('deleteDevice', () => {
        it('should delete a device successfully', async () => {
            mockReq.params.id = 'device123';
            mockDeviceService.deleteDeviceById.mockResolvedValue(true);

            await deviceController.deleteDevice(mockReq, mockRes);

            expect(deviceService.deleteDeviceById).toHaveBeenCalledWith('device123', mockUser.id);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, message: 'Device deleted successfully' });
        });

        it('should handle errors when deleting a device', async () => {
            const error = new Error('Device not found');
            mockReq.params.id = 'non-existent';
            mockDeviceService.deleteDeviceById.mockRejectedValue(error);

            await deviceController.deleteDevice(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Device not found' });
        });
    });

    describe('updateHeartbeat', () => {
        it('should update device heartbeat successfully', async () => {
            mockReq.params.id = 'device123';
            mockDeviceService.updateDeviceHeartbeat.mockResolvedValue(mockDevice);

            await deviceController.updateHeartbeat(mockReq, mockRes);

            expect(deviceService.updateDeviceHeartbeat).toHaveBeenCalledWith('device123', mockUser.id);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Device heartbeat recorded',
                last_active_at: mockDevice.lastActiveAt.toISOString()
            });
        });

        it('should handle errors when updating heartbeat', async () => {
            const error = new Error('Device not found');
            mockReq.params.id = 'non-existent';
            mockDeviceService.updateDeviceHeartbeat.mockRejectedValue(error);

            await deviceController.updateHeartbeat(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Device not found' });
        });
    });
});
