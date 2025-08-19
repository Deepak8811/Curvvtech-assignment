// validators/device.validation.js
import Joi from "joi";
import { objectId } from "./custom.validation.js";

/**
 * @desc Validation for creating a new device
 */
const createDevice = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            "string.base": "Device name must be a string",
            "string.empty": "Device name is required",
        }),
        type: Joi.string()
            .required()
            .valid("light", "meter", "thermostat", "camera", "other")
            .messages({
                "any.required": "Device type is required",
                "any.only": "Device type must be one of light, meter, thermostat, camera, or other",
            }),
        status: Joi.string().valid("active", "inactive", "faulty").messages({
            "any.only": "Status must be one of active, inactive, or faulty",
        }),
    }),
};

/**
 * @desc Validation for fetching devices with filters
 */
const getDevices = {
    query: Joi.object().keys({
        type: Joi.string().valid("light", "meter", "thermostat", "camera", "other"),
        status: Joi.string().valid("active", "inactive", "faulty"),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
    }),
};

/**
 * @desc Validation for fetching a single device by ID
 */
const getDevice = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
};

/**
 * @desc Validation for updating a device
 */
const updateDevice = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            type: Joi.string().valid("light", "meter", "thermostat", "camera", "other"),
            status: Joi.string().valid("active", "inactive", "faulty"),
        })
        .min(1), // ensure at least one field is provided
};

/**
 * @desc Validation for deleting a device
 */
const deleteDevice = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
};

export default {
    createDevice,
    getDevices,
    getDevice,
    updateDevice,
    deleteDevice,
};
