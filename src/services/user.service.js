const User = require('../models/user.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.findOne({ email: userBody.email })) {
        // In a real app, you'd throw a specific error type here.
        throw new Error('Email already taken');
    }
    return User.create(userBody);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

module.exports = {
    createUser,
    getUserByEmail,
};
