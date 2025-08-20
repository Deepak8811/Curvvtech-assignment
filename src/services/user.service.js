import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
import { hashPassword } from '../utils/password.js';

const createUser = async (userBody) => {
    const existingUser = await User.findOne({ email: userBody.email });
    if (existingUser) {
        throw new ApiError(400, 'Email already taken');
    }

    // Hash the password before creating the user
    const hashedPassword = await hashPassword(userBody.password);
    const user = await User.create({ ...userBody, password: hashedPassword });
    return user.toJSON();
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email, includePassword = false) => {
    const query = User.findOne({ email });
    if (includePassword) {
        query.select('+password');
    }
    return query.exec();
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
