import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    // Check if email already exists
    const existingUser = await User.findOne({ email: userBody.email });
    if (existingUser) {
        // Using plain status code instead of http-status
        throw new ApiError(400, 'Email already taken');
    }

    // Create and save user
    const user = await User.create(userBody);
    return user.toJSON(); // ensures password is stripped out
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

/**
 * Get user by ID
 * @param {string} id
 * @returns {Promise<User | null>}
 */
const getUserById = async (id) => {
    return User.findById(id);
};

export default {
    createUser,
    getUserByEmail,
    getUserById,
};
