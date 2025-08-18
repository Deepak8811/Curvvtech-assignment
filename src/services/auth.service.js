const userService = require('./user.service');
const tokenService = require('./token.service');
const { comparePassword } = require('../utils/password');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
        // In a real app, you'd throw a specific error type here.
        throw new Error('Incorrect email or password');
    }
    const tokens = tokenService.generateAuthTokens(user);
    return { user, tokens };
};

module.exports = {
    loginUserWithEmailAndPassword,
};
