import Joi from 'joi';

export const register = {
    body: Joi.object({
        name: Joi.string()
            .required()
            .min(2)
            .max(50)
            .messages({
                'string.empty': 'Name is required',
                'string.min': 'Name must be at least 2 characters',
                'string.max': 'Name cannot be longer than 50 characters',
                'any.required': 'Name is required'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(8)
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            }),
        role: Joi.string()
            .valid('user', 'admin')
            .default('user')
            .messages({
                'any.only': 'Role must be either user or admin'
            })
    })
};

export const login = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            })
    })
};

export default { register, login };
