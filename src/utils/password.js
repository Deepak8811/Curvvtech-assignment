import bcrypt from 'bcrypt';

const saltRounds = 12; // As per the guide's recommendation (cost >= 12)

/**
 * Hashes a password using bcrypt.
 * @param {string} password The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
    return bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plaintext password with a hash.
 * @param {string} password The plaintext password.
 * @param {string} hash The hashed password.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

export { hashPassword, comparePassword };
