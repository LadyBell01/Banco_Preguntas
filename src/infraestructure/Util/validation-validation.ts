import Joi from 'joi';
import { ValidationResult } from '../../domain/entities/QuestionValidation.js';

export const validationSchema = Joi.object({
  questionId: Joi.number().required(),
  result: Joi.string().valid(ValidationResult.APROBADA, ValidationResult.RECHAZADA).required(),
  observations: Joi.string().min(10).required()
});
