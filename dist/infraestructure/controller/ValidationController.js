import { validationSchema } from '../Util/validation-validation.js';
import { ValidationError, UnauthorizedError } from '../web/errorMiddleware.js';
export class ValidationController {
    validationUseCase;
    constructor(validationUseCase) {
        this.validationUseCase = validationUseCase;
    }
    async validateQuestion(req, res, next) {
        try {
            const { error, value } = validationSchema.validate(req.body);
            if (error) {
                throw new ValidationError('Validation Error', error.details.map(d => d.message));
            }
            const validatorId = req.user?.id;
            if (!validatorId) {
                throw new UnauthorizedError('No user found in request');
            }
            const validation = await this.validationUseCase.createValidation({
                ...value,
                validatorId
            });
            return res.status(201).json({
                message: `Pregunta ${value.result.toLowerCase()} exitosamente`,
                validationId: validation.id
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getValidationsByQuestion(req, res, next) {
        try {
            const questionId = parseInt(req.params.questionId, 10);
            const validations = await this.validationUseCase.findByQuestionId(questionId);
            return res.status(200).json(validations);
        }
        catch (error) {
            next(error);
        }
    }
    async getMyValidations(req, res, next) {
        try {
            const validatorId = req.user?.id;
            if (!validatorId) {
                throw new UnauthorizedError('No user found in request');
            }
            const validations = await this.validationUseCase.findByValidatorId(validatorId);
            return res.status(200).json(validations);
        }
        catch (error) {
            next(error);
        }
    }
}
