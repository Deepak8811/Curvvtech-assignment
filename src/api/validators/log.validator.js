const Joi = require('joi');

const createLog = {
    body: Joi.object().keys({
        event: Joi.string().required(),
        value: Joi.any().required(),
    }),
};

const getUsage = {
    query: Joi.object().keys({
        range: Joi.string().pattern(new RegExp('^\d+[hdw]$')).default('24h'),
    }),
};

module.exports = {
    createLog,
    getUsage,
};
