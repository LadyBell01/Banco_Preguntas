import { QuestionUseCase, CreateQuestionWithOptionsDTO } from "../../application/use-cases/QuestionUseCase.js";
import { Request, Response } from "express";
import { loadQuestionData, loadUpdateQuestionData, loadUpdateOptionsData } from "../Util/question-validation.js";
import { Difficulty, QuestionStatus } from "../../domain/entities/Question.js";

export class QuestionController {
  private useCase: QuestionUseCase;

  constructor(useCase: QuestionUseCase) {
    this.useCase = useCase;
  }

  async createQuestion(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = loadQuestionData(req.body);

      const questionData: CreateQuestionWithOptionsDTO = {
        statement: validatedData.statement,
        difficulty: validatedData.difficulty as Difficulty,
        categoryId: validatedData.categoryId,
        status: validatedData.status as QuestionStatus,
        options: validatedData.options,
      };

      const questionId = await this.useCase.createQuestionWithOptions(questionData);

      return res.status(201).json({
        message: "Pregunta creada con éxito",
        questionId,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al crear pregunta",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getAllQuestions(req: Request, res: Response): Promise<Response> {
    try {
      const questions = await this.useCase.getAllQuestionsWithOptions();
      return res.status(200).json(questions);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener preguntas" });
    }
  }

  async getQuestionById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const question = await this.useCase.getQuestionWithOptions(id);

      if (!question) {
        return res.status(404).json({ message: "Pregunta no encontrada" });
      }

      return res.status(200).json(question);
    } catch (error) {
      return res.status(500).json({ error: "Error al buscar pregunta" });
    }
  }

  async getQuestionsByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = Number(req.params.categoryId);
      if (Number.isNaN(categoryId)) {
        return res.status(400).json({ error: "ID de categoría inválido" });
      }

      const questions = await this.useCase.getQuestionsByCategory(categoryId);
      return res.status(200).json(questions);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al obtener preguntas",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al obtener preguntas por categoría" });
    }
  }

  async getQuestionsByDifficulty(req: Request, res: Response): Promise<Response> {
    try {
      const difficulty = req.params.difficulty as string;
      const validDifficulties = ["Baja", "Media", "Alta"];

    if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          error: "Dificultad inválida",
          details: "Debe ser: Baja, Media o Alta",
        });
      }

      const questions = await this.useCase.getQuestionsByDifficulty(difficulty as Difficulty);
      return res.status(200).json(questions);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener preguntas por dificultad" });
    }
  }

  async getQuestionsByStatus(req: Request, res: Response): Promise<Response> {
    try {
      const status = req.params.status as string;
      const validStatuses = ["Borrador", "Revisión", "Aprobada", "Publicada"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: "Estado inválido",
          details: "Debe ser: Borrador, Revisión, Aprobada o Publicada",
        });
      }

      const questions = await this.useCase.getQuestionsByStatus(status as QuestionStatus);
      return res.status(200).json(questions);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener preguntas por estado" });
    }
  }

  async updateQuestion(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const validatedData = loadUpdateQuestionData(req.body);
      const updated = await this.useCase.updateQuestion(id, {
        statement: validatedData.statement,
        difficulty: validatedData.difficulty as Difficulty | undefined,
        categoryId: validatedData.categoryId,
        status: validatedData.status as QuestionStatus | undefined,
      });

      return res.status(200).json({
        message: "Pregunta actualizada",
        updated,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al actualizar",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al actualizar pregunta" });
    }
  }

  async updateQuestionStatus(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const { status } = req.body;
      const validStatuses = ["Borrador", "Revisión", "Aprobada", "Publicada"];

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          error: "Estado inválido",
          details: "Debe ser: Borrador, Revisión, Aprobada o Publicada",
        });
      }

      const updated = await this.useCase.updateQuestionStatus(id, status as QuestionStatus);

      return res.status(200).json({
        message: "Estado de pregunta actualizado",
        updated,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al actualizar estado",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al actualizar estado" });
    }
  }

  async updateQuestionOptions(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const validatedData = loadUpdateOptionsData(req.body);
      const updated = await this.useCase.updateQuestionOptions(id, validatedData.options);

      return res.status(200).json({
        message: "Opciones de pregunta actualizadas",
        updated,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al actualizar opciones",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al actualizar opciones" });
    }
  }

  async deleteQuestion(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await this.useCase.deleteQuestion(id);

      return res.status(200).json({ message: "Pregunta eliminada con éxito" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al eliminar pregunta",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al eliminar pregunta" });
    }
  }
}
