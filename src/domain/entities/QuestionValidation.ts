export enum ValidationResult {
  APROBADA = "Aprobada",
  RECHAZADA = "Rechazada",
}

export interface QuestionValidation {
  id_question_validations: number;
  questionId: number;
  validatorId: number;
  result: ValidationResult;
  observations: string;
  validatedAt: Date;
}
