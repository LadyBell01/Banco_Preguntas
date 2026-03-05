import Joi from 'joi';
export const categorySchema = Joi.object({
    name: Joi.string().required().max(255),
    description: Joi.string().optional().allow(''),
    status: Joi.number().valid(1, 0).optional()
});
export const updateCategorySchema = Joi.object({
    name: Joi.string().max(255).optional(),
    description: Joi.string().optional().allow(''),
    status: Joi.number().valid(1, 0).optional()
});
