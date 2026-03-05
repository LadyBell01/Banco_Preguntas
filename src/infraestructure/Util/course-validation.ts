import Joi from 'joi';

export const courseSchema = Joi.object({
  name: Joi.string().required().max(255),
  description: Joi.string().optional().allow(''),
  status: Joi.number().valid(1, 0).optional()
});

export const updateCourseSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  description: Joi.string().optional().allow(''),
  status: Joi.number().valid(1, 0).optional()
});
