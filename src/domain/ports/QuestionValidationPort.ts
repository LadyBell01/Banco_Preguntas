import { QuestionValidation } from "../entities/QuestionValidation.js";

export interface QuestionValidationPort {
  createValidation(validation: Omit<QuestionValidation, "id_question_validations" | "validatedAt">): Promise<number>;
  getValidationsByQuestionId(questionId: number): Promise<QuestionValidation[]>;
  getValidationsByValidatorId(validatorId: number): Promise<QuestionValidation[]>;
  getLastValidation(questionId: number): Promise<QuestionValidation | null>;
}
