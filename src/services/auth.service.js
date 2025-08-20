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
    const user = await userService.getUserByEmail(email, true);
    
    if (!user) {
        throw new Error('Incorrect email or password');
    }
    
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Incorrect email or password');
    }
    
    const userObj = user.toObject();
    delete userObj.password;
    
    if (userObj._id && !userObj.id) {
        userObj.id = userObj._id.toString();
    }
    
    const tokens = await tokenService.generateAuthTokens(userObj);
    return { user: userObj, tokens };
};

export default {
    loginUserWithEmailAndPassword,
};
