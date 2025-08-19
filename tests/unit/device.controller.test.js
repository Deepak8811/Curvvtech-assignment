const deviceController = require('../../src/api/controllers/device.controller');
const deviceService = require('../../src/services/device.service');

// Mock the device service
jest.mock('../../src/services/device.service');

describe('Device Controller Unit Tests', () => {
    let mockReq, mockRes, mockNext;
    const mockUser = { id: 'user123' };
    const mockDevice = {
        id: 'device123',
        name: 'Test Device',
        userId: 'user123',
        lastActiveAt: new Date(),
        toJSON: function() { return { ...this, lastActiveAt: this.lastActiveAt.toISOString() } }
    };

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            params: {},
            body: {},
            query: {},
            user: { ...mockUser }
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };
        
        mockNext = jest.fn();
    });

    describe('createDevice', () => {
        it('should create a new device successfully', async () => {
            // Arrange
            const deviceData = { name: 'Test Device', type: 'sensor' };
            mockReq.body = deviceData;
            deviceService.createDevice.mockResolvedValue(mockDevice);

            // Act
            await deviceController.createDevice(mockReq, mockRes);

            // Assert
            expect(deviceService.createDevice).toHaveBeenCalledWith(
                deviceData,
                mockUser.id
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                device: mockDevice
            });
        });
    });

    describe('getDevices', () => {
        it('should return a list of devices', async () => {
            // Arrange
            const queryParams = { type: 'sensor' };
            const mockDevices = [mockDevice];
            mockReq.query = queryParams;
            deviceService.queryDevices.mockResolvedValue(mockDevices);

            // Act
            await deviceController.getDevices(mockReq, mockRes);

            // Assert
            expect(deviceService.queryDevices).toHaveBeenCalledWith(
                queryParams,
                mockUser.id
            );
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                devices: mockDevices
            });
        });
    });

    describe('getDevice', () => {
        it('should return a device by id', async () => {
            // Arrange
            const deviceId = 'device123';
            mockReq.params.id = deviceId;
            deviceService.getDeviceById.mockResolvedValue(mockDevice);

            // Act
            await deviceController.getDevice(mockReq, mockRes);

            // Assert
            expect(deviceService.getDeviceById).toHaveBeenCalledWith(
                deviceId,
                mockUser.id
            );
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                device: mockDevice
            });
        });

        it('should return 404 if device not found', async () => {
            // Arrange
            const deviceId = 'non-existent';
            mockReq.params.id = deviceId;
            deviceService.getDeviceById.mockResolvedValue(null);

            // Act
            await deviceController.getDevice(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: 'Device not found'
            });
        });
    });

    describe('updateDevice', () => {
        it('should update a device successfully', async () => {
            // Arrange
            const deviceId = 'device123';
            const updateData = { name: 'Updated Device' };
            mockReq.params.id = deviceId;
            mockReq.body = updateData;
            deviceService.updateDeviceById.mockResolvedValue(mockDevice);

            // Act
            await deviceController.updateDevice(mockReq, mockRes);

            // Assert
            expect(deviceService.updateDeviceById).toHaveBeenCalledWith(
                deviceId,
                updateData,
                mockUser.id
            );
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                device: mockDevice
            });
        });

        it('should handle update errors', async () => {
            // Arrange
            const error = new Error('Device not found');
            mockReq.params.id = 'non-existent';
            deviceService.updateDeviceById.mockRejectedValue(error);

            // Act
            await deviceController.updateDevice(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: 'Device not found'
            });
        });
    });

    describe('deleteDevice', () => {
        it('should delete a device successfully', async () => {
            // Arrange
            const deviceId = 'device123';
            mockReq.params.id = deviceId;
            deviceService.deleteDeviceById.mockResolvedValue(true);

            // Act
            await deviceController.deleteDevice(mockReq, mockRes);

            // Assert
            expect(deviceService.deleteDeviceById).toHaveBeenCalledWith(
                deviceId,
                mockUser.id
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: 'Device deleted successfully'
            });
        });

        it('should handle delete errors', async () => {
            // Arrange
            const error = new Error('Device not found');
            mockReq.params.id = 'non-existent';
            deviceService.deleteDeviceById.mockRejectedValue(error);

            // Act
            await deviceController.deleteDevice(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: 'Device not found'
            });
        });
    });

    describe('updateHeartbeat', () => {
        it('should update device heartbeat successfully', async () => {
            // Arrange
            const deviceId = 'device123';
            mockReq.params.id = deviceId;
            deviceService.updateDeviceHeartbeat.mockResolvedValue(mockDevice);

            // Act
            await deviceController.updateHeartbeat(mockReq, mockRes);

            // Assert
            expect(deviceService.updateDeviceHeartbeat).toHaveBeenCalledWith(
                deviceId,
                mockUser.id
            );
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: 'Device heartbeat recorded',
                last_active_at: mockDevice.lastActiveAt.toISOString()
            });
        });

        it('should handle heartbeat update errors', async () => {
            // Arrange
            const error = new Error('Device not found');
            mockReq.params.id = 'non-existent';
            deviceService.updateDeviceHeartbeat.mockRejectedValue(error);

            // Act
            await deviceController.updateHeartbeat(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: 'Device not found'
            });
        });
    });
});
