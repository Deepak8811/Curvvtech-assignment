const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const validSchema = Joi.compile(schema);
    const { value, error } = validSchema.validate(req.body);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        // In a real app, you'd use a specific error handler and class.
        return res.status(400).json({ success: false, message: 'Validation error', details: errorMessage });
    }
    Object.assign(req, value);
    return next();
};

module.exports = validate;
