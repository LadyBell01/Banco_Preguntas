import { Repository } from "typeorm";
import { QuestionValidation as ValidationDomain, ValidationResult } from "../../domain/entities/QuestionValidation.js";
import { QuestionValidation as ValidationEntity, ValidationResultEnum } from "../entities/QuestionValidation.js";
import { QuestionValidationPort } from "../../domain/ports/QuestionValidationPort.js";
import { AppDataSource } from "../config/data-base.js";

export class QuestionValidationAdapter implements QuestionValidationPort {
  private validationRepository: Repository<ValidationEntity>;

  constructor() {
    this.validationRepository = AppDataSource.getRepository(ValidationEntity);
  }

  private toDomain(validation: ValidationEntity): ValidationDomain {
    return {
      id: validation.id_validation,
      questionId: validation.question_id,
      validatorId: validation.validator_id,
      result: validation.result_validation as unknown as ValidationResult,
      observations: validation.observations_validation,
      validatedAt: validation.validated_at,
    };
  }

  async createValidation(validation: Omit<ValidationDomain, "id" | "validatedAt">): Promise<number> {
    try {
      const newValidation = new ValidationEntity();
      newValidation.question_id = validation.questionId;
      newValidation.validator_id = validation.validatorId;
      newValidation.result_validation = validation.result as unknown as ValidationResultEnum;
      newValidation.observations_validation = validation.observations;

      const savedValidation = await this.validationRepository.save(newValidation);
      return savedValidation.id_validation;
    } catch (error) {
      console.error("Error creando validación:", error);
      throw new Error("Error al crear validación");
    }
  }

  async getValidationsByQuestionId(questionId: number): Promise<ValidationDomain[]> {
    try {
      const validations = await this.validationRepository.find({
        where: { question_id: questionId },
        order: { validated_at: "DESC" },
      });
      return validations.map((v) => this.toDomain(v));
    } catch (error) {
      console.error("Error obteniendo validaciones:", error);
      throw new Error("Error obteniendo validaciones");
    }
  }

  async getValidationsByValidatorId(validatorId: number): Promise<ValidationDomain[]> {
    try {
      const validations = await this.validationRepository.find({
        where: { validator_id: validatorId },
        order: { validated_at: "DESC" },
      });
      return validations.map((v) => this.toDomain(v));
    } catch (error) {
      console.error("Error obteniendo validaciones del validador:", error);
      throw new Error("Error obteniendo validaciones");
    }
  }

  async getLastValidation(questionId: number): Promise<ValidationDomain | null> {
    try {
      const validation = await this.validationRepository.findOne({
        where: { question_id: questionId },
        order: { validated_at: "DESC" },
      });
      return validation ? this.toDomain(validation) : null;
    } catch (error) {
      console.error("Error obteniendo última validación:", error);
      throw new Error("Error obteniendo última validación");
    }
  }
}
