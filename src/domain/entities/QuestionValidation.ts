export enum ValidationResult {
  APROBADA = "Aprobada",
  RECHAZADA = "Rechazada",
}

export interface QuestionValidation {
  id: number;
  questionId: number;
  validatorId: number;
  result: ValidationResult;
  observations: string;
  validatedAt: Date;
}
