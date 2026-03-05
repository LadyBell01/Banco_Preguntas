import Joi from 'joi';
export const unitSchema = Joi.object({
    name: Joi.string().required().max(255),
    description: Joi.string().optional().allow(''),
    courseId: Joi.number().required(),
    status: Joi.number().valid(1, 0).optional()
});
export const updateUnitSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    description: Joi.string().optional().allow(''),
    courseId: Joi.number().optional(),
    status: Joi.number().valid(1, 0).optional()
});
