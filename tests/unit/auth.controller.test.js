import { jest } from '@jest/globals';
import authController from '../../src/api/controllers/auth.controller.js';
import userService from '../../src/services/user.service.js';
import authService from '../../src/services/auth.service.js';
import tokenService from '../../src/services/token.service.js';

// Mock the services with proper jest.fn() mocks
const mockUserService = {
  createUser: jest.fn()
};

const mockAuthService = {
  loginUserWithEmailAndPassword: jest.fn()
};

const mockTokenService = {
  generateAuthTokens: jest.fn()
};

jest.mock('../../src/services/user.service.js', () => mockUserService);
jest.mock('../../src/services/auth.service.js', () => mockAuthService);
jest.mock('../../src/services/token.service.js', () => mockTokenService);


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
            const userData = {
                name: 'Deepak chaurasiya',
                email: 'deepchaurasiya1997@gmial.com',
                password: '12345678'
            };
            mockReq.body = userData;

            // Mock the userService.createUser to resolve successfully
            const mockUser = { 
                ...userData,
                _id: '123',
                toObject: () => ({
                    id: '123',
                    name: userData.name,
                    email: userData.email,
                    role: 'user'
                })
            };
            
            // Mock the token service
            const mockTokens = { access: { token: 'test-token' } };
            mockTokenService.generateAuthTokens.mockResolvedValue(mockTokens);
            mockUserService.createUser.mockResolvedValue(mockUser);

            // Act
            await authController.register(mockReq, mockRes);

            // Assert
            expect(userService.createUser).toHaveBeenCalledWith(expect.objectContaining({
                name: userData.name,
                email: userData.email,
                password: expect.any(String) // Password should be hashed
            }));
            
            expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(expect.objectContaining({
                id: '123',
                name: userData.name,
                email: userData.email
            }));
            
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                token: 'test-token',
                user: {
                    id: '123',
                    name: userData.name,
                    email: userData.email,
                    role: 'user'
                }
            });
        });

        it('should handle registration errors', async () => {
            // Arrange
            const error = new Error('Registration failed');
            mockUserService.createUser.mockRejectedValue(error);

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

            mockAuthService.loginUserWithEmailAndPassword.mockResolvedValue({
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
            mockAuthService.loginUserWithEmailAndPassword.mockRejectedValue(error);

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
