import userService from '../../services/user.service.js';
import authService from '../../services/auth.service.js';
import tokenService from '../../services/token.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * @desc    Register a new user
 * @route   POST /v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    
    const userObj = user.toObject();
    if (userObj._id && !userObj.id) {
        userObj.id = userObj._id.toString();
    }
    
    const tokens = await tokenService.generateAuthTokens(userObj);

    return res.status(201).json({
        success: true,
        token: tokens.access.token,
        user: {
            id: userObj.id,
            name: userObj.name,
            email: userObj.email,
            role: userObj.role,
        }
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
        token: tokens.access.token,
        user: {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
});

export default {
    register,
    login,
};
