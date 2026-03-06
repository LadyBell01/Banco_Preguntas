import { loadQuestionData, loadUpdateQuestionData, loadUpdateOptionsData } from "../Util/question-validation.js";
export class QuestionController {
    useCase;
    constructor(useCase) {
        this.useCase = useCase;
    }
    async createQuestion(req, res) {
        try {
            const validatedData = loadQuestionData(req.body);
            const questionData = {
                statement: validatedData.statement,
                difficulty: validatedData.difficulty,
                category_id: validatedData.categoryId,
                status: validatedData.status,
                options: validatedData.options,
            };
            const questionId = await this.useCase.createQuestionWithOptions(questionData);
            return res.status(201).json({
                message: "Pregunta creada con éxito",
                questionId,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al crear pregunta",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async getAllQuestions(req, res) {
        try {
            const questions = await this.useCase.getAllQuestionsWithOptions();
            return res.status(200).json(questions);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener preguntas" });
        }
    }
    async getQuestionById(req, res) {
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
        }
        catch (error) {
            return res.status(500).json({ error: "Error al buscar pregunta" });
        }
    }
    async getQuestionsByCategory(req, res) {
        try {
            const categoryId = Number(req.params.categoryId);
            if (Number.isNaN(categoryId)) {
                return res.status(400).json({ error: "ID de categoría inválido" });
            }
            const questions = await this.useCase.getQuestionsByCategory(categoryId);
            return res.status(200).json(questions);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al obtener preguntas",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al obtener preguntas por categoría" });
        }
    }
    async getQuestionsByDifficulty(req, res) {
        try {
            const difficulty = req.params.difficulty;
            const validDifficulties = ["Baja", "Media", "Alta"];
            if (!validDifficulties.includes(difficulty)) {
                return res.status(400).json({
                    error: "Dificultad inválida",
                    details: "Debe ser: Baja, Media o Alta",
                });
            }
            const questions = await this.useCase.getQuestionsByDifficulty(difficulty);
            return res.status(200).json(questions);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener preguntas por dificultad" });
        }
    }
    async getQuestionsByStatus(req, res) {
        try {
            const status = req.params.status;
            const validStatuses = ["Borrador", "Revisión", "Aprobada", "Publicada"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    error: "Estado inválido",
                    details: "Debe ser: Borrador, Revisión, Aprobada o Publicada",
                });
            }
            const questions = await this.useCase.getQuestionsByStatus(status);
            return res.status(200).json(questions);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener preguntas por estado" });
        }
    }
    async updateQuestion(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const validatedData = loadUpdateQuestionData(req.body);
            const updated = await this.useCase.updateQuestion(id, {
                statement: validatedData.statement,
                difficulty: validatedData.difficulty,
                category_id: validatedData.categoryId,
                status: validatedData.status,
            });
            return res.status(200).json({
                message: "Pregunta actualizada",
                updated,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al actualizar",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al actualizar pregunta" });
        }
    }
    async updateQuestionStatus(req, res) {
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
            const updated = await this.useCase.updateQuestionStatus(id, status);
            return res.status(200).json({
                message: "Estado de pregunta actualizado",
                updated,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al actualizar estado",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al actualizar estado" });
        }
    }
    async updateQuestionOptions(req, res) {
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
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al actualizar opciones",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al actualizar opciones" });
        }
    }
    async deleteQuestion(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            await this.useCase.deleteQuestion(id);
            return res.status(200).json({ message: "Pregunta eliminada con éxito" });
        }
        catch (error) {
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
