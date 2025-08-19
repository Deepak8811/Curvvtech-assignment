const authController = require('../../src/api/controllers/auth.controller');
const userService = require('../../src/services/user.service');
const authService = require('../../src/services/auth.service');

// Mock the services
jest.mock('../../src/services/user.service');
jest.mock('../../src/services/auth.service');

describe('Auth Controller Unit Tests', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {}
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };
        
        mockNext = jest.fn();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            // Arrange
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!'
            };
            mockReq.body = userData;
            
            // Mock the userService.createUser to resolve successfully
            userService.createUser.mockResolvedValue({});

            // Act
            await authController.register(mockReq, mockRes);

            // Assert
            expect(userService.createUser).toHaveBeenCalledWith(userData);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: 'User registered successfully'
            });
        });

        it('should handle registration errors', async () => {
            // Arrange
            const error = new Error('Registration failed');
            userService.createUser.mockRejectedValue(error);

            // Act
            await authController.register(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: 'Registration failed'
            });
        });
    });

    describe('login', () => {
        it('should log in a user successfully', async () => {
            // Arrange
            const credentials = {
                email: 'test@example.com',
                password: 'Password123!'
            };
            mockReq.body = credentials;
            
            const mockUser = { id: '1', email: 'test@example.com' };
            const mockTokens = { access: { token: 'mock-token' } };
            
            authService.loginUserWithEmailAndPassword.mockResolvedValue({
                user: mockUser,
                tokens: mockTokens
            });

            // Act
            await authController.login(mockReq, mockRes);

            // Assert
            expect(authService.loginUserWithEmailAndPassword).toHaveBeenCalledWith(
                credentials.email,
                credentials.password
            );
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                token: mockTokens.access.token,
                user: mockUser
            });
        });

        it('should handle login errors', async () => {
            // Arrange
            const error = new Error('Invalid credentials');
            authService.loginUserWithEmailAndPassword.mockRejectedValue(error);

            // Act
            await authController.login(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid credentials'
            });
        });
    });
});
