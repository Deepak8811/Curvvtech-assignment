const Joi = require('joi');
const { objectId } = require('./custom.validation'); // We will create this custom validator

const createDevice = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.string().required().valid('light', 'meter', 'thermostat', 'camera', 'other'),
        status: Joi.string().valid('active', 'inactive', 'faulty'),
    }),
};

const getDevices = {
    query: Joi.object().keys({
        type: Joi.string(),
        status: Joi.string(),
        page: Joi.number().integer(),
        limit: Joi.number().integer(),
    }),
};

const getDevice = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
};

const updateDevice = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            type: Joi.string().valid('light', 'meter', 'thermostat', 'camera', 'other'),
            status: Joi.string().valid('active', 'inactive', 'faulty'),
        })
        .min(1),
};

const deleteDevice = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    createDevice,
    getDevices,
    getDevice,
    updateDevice,
    deleteDevice,
};
