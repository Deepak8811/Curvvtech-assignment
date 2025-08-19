import userService from './user.service.js';
import tokenService from './token.service.js';
import { comparePassword } from '../utils/password.js';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
        throw new Error('Incorrect email or password');
    }
    const tokens = tokenService.generateAuthTokens(user);
    return { user, tokens };
};

export default {
    loginUserWithEmailAndPassword,
};
