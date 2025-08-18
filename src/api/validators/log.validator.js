const Joi = require('joi');

const createLog = {
    body: Joi.object().keys({
        event: Joi.string().required(),
        value: Joi.any().required(),
    }),
};

const getLogs = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100),
    }),
};

const getUsage = {
    query: Joi.object().keys({
        range: Joi.string().pattern(new RegExp('^\d+[hdw]$')).default('24h'),
    }),
};

module.exports = {
    createLog,
    getLogs,
    getUsage,
};
