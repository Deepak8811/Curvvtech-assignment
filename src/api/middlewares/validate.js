const validate = (schema) => (req, res, next) => {
    // For GET requests, validate query parameters
    // For other methods, validate request body
    const dataToValidate = req.method === 'GET' ? req.query : req.body;
    const validationTarget = req.method === 'GET' ? 'query' : 'body';
    
    if (!schema[validationTarget]) {
        return next();
    }
    
    const { error, value } = schema[validationTarget].validate(dataToValidate, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    });

    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            details: errorMessage
        });
    }

    // Update the validated data back to the request object
    if (validationTarget === 'query') {
        req.query = value;
    } else {
        req.body = value;
    }
    
    return next();
};

export default validate;
