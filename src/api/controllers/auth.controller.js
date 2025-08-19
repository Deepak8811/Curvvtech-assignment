import userService from '../../services/user.service.js';
import authService from '../../services/auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * @desc    Register a new user
 * @route   POST /v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);

    // Generate auth tokens after successful registration
    const tokens = await authService.generateAuthTokens(user);

    return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        tokens,
    });
});

/**
 * @desc    Login user
 * @route   POST /v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { user, tokens } = await authService.loginUserWithEmailAndPassword(
        email,
        password
    );

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        tokens,
    });
});

export default {
    register,
    login,
};
