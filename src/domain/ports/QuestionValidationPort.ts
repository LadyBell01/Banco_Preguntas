import { QuestionValidation } from '../entities/QuestionValidation.js';

export interface QuestionValidationPort {
  create(validation: QuestionValidation): Promise<QuestionValidation>;
  findByQuestionId(questionId: number): Promise<QuestionValidation[]>;
  findByValidatorId(validatorId: number): Promise<QuestionValidation[]>;
}
