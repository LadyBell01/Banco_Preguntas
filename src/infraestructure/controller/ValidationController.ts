import { ValidationUseCase, ValidateQuestionDTO } from "../../application/use-cases/ValidationUseCase.js";
import { Response } from "express";
import { loadValidationData } from "../Util/validation-validation.js";
import { ValidationResult } from "../../domain/entities/QuestionValidation.js";
import { AuthenticatedRequest } from "../web/roleMiddleware.js";

export class ValidationController {
  private useCase: ValidationUseCase;

  constructor(useCase: ValidationUseCase) {
    this.useCase = useCase;
  }

  async validateQuestion(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const validatedData = loadValidationData(req.body);

      if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
      }

      const validationData: ValidateQuestionDTO = {
        questionId: validatedData.questionId,
        validatorId: req.user.id,
        result: validatedData.result as ValidationResult,
        observations: validatedData.observations,
      };

      const validationId = await this.useCase.validateQuestion(validationData);

      return res.status(201).json({
        message: `Pregunta ${validatedData.result.toLowerCase()} exitosamente`,
        validationId,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al validar pregunta",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getValidationHistory(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const questionId = Number(req.params.questionId);
      if (Number.isNaN(questionId)) {
        return res.status(400).json({ error: "ID de pregunta inválido" });
      }

      const validations = await this.useCase.getValidationHistory(questionId);
      return res.status(200).json(validations);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al obtener historial",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al obtener historial de validaciones" });
    }
  }

  async getMyValidations(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
      }

      const validations = await this.useCase.getMyValidations(req.user.id);
      return res.status(200).json(validations);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener mis validaciones" });
    }
  }

  async sendToReview(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const questionId = Number(req.params.questionId);
      if (Number.isNaN(questionId)) {
        return res.status(400).json({ error: "ID de pregunta inválido" });
      }

      await this.useCase.sendToReview(questionId);

      return res.status(200).json({
        message: "Pregunta enviada a revisión exitosamente",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al enviar a revisión",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al enviar a revisión" });
    }
  }

  async publishQuestion(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const questionId = Number(req.params.questionId);
      if (Number.isNaN(questionId)) {
        return res.status(400).json({ error: "ID de pregunta inválido" });
      }

      await this.useCase.publishQuestion(questionId);

      return res.status(200).json({
        message: "Pregunta publicada exitosamente",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al publicar pregunta",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al publicar pregunta" });
    }
  }
}
