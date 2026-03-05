import { QuestionValidation, ValidationResult } from '../../domain/entities/QuestionValidation.js';
import { QuestionValidationPort } from '../../domain/ports/QuestionValidationPort.js';
import { QuestionPort } from '../../domain/ports/QuestionPort.js';
import { QuestionStatus } from '../../domain/entities/Question.js';
import { NotFoundError, BadRequestError } from '../../infraestructure/web/errorMiddleware.js';

export class ValidationUseCase {
  constructor(
    private readonly validationPort: QuestionValidationPort,
    private readonly questionPort: QuestionPort
  ) { }

  async createValidation(validation: QuestionValidation): Promise<QuestionValidation> {
    const question = await this.questionPort.getQuestionById(validation.questionId);

    if (!question) {
      throw new NotFoundError('La pregunta no existe');
    }

    if (question.status !== QuestionStatus.REVISION) {
      throw new BadRequestError('Solo se pueden validar preguntas que estén en estado "Revisión"');
    }

    if (!validation.observations || validation.observations.length < 10) {
      throw new BadRequestError('Las observaciones deben tener al menos 10 caracteres');
    }

    const validationToCreate = {
      ...validation,
      validatedAt: new Date()
    };

    const newValidation = await this.validationPort.create(validationToCreate);

    // Actualizar el estado de la pregunta según el resultado
    const newStatus = validation.result === ValidationResult.APROBADA
      ? QuestionStatus.APROBADA
      : QuestionStatus.RECHAZADA;

    await this.questionPort.updateQuestion(question.id, { status: newStatus });

    return newValidation;
  }

  async findByQuestionId(questionId: number): Promise<QuestionValidation[]> {
    return this.validationPort.findByQuestionId(questionId);
  }

  async findByValidatorId(validatorId: number): Promise<QuestionValidation[]> {
    return this.validationPort.findByValidatorId(validatorId);
  }
}
