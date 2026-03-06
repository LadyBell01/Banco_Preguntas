import { loadValidationData } from "../Util/validation-validation.js";
export class ValidationController {
    useCase;
    constructor(useCase) {
        this.useCase = useCase;
    }
    async validateQuestion(req, res) {
        try {
            const validatedData = loadValidationData(req.body);
            if (!req.user) {
                return res.status(401).json({ error: "No autenticado" });
            }
            const validationData = {
                questionId: validatedData.questionId,
                validatorId: req.user.id,
                result: validatedData.result,
                observations: validatedData.observations,
            };
            const validationId = await this.useCase.validateQuestion(validationData);
            return res.status(201).json({
                message: `Pregunta ${validatedData.result.toLowerCase()} exitosamente`,
                validationId,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al validar pregunta",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async getValidationHistory(req, res) {
        try {
            const questionId = Number(req.params.questionId);
            if (Number.isNaN(questionId)) {
                return res.status(400).json({ error: "ID de pregunta inválido" });
            }
            const validations = await this.useCase.getValidationHistory(questionId);
            return res.status(200).json(validations);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al obtener historial",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al obtener historial de validaciones" });
        }
    }
    async getMyValidations(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "No autenticado" });
            }
            const validations = await this.useCase.getMyValidations(req.user.id);
            return res.status(200).json(validations);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener mis validaciones" });
        }
    }
    async sendToReview(req, res) {
        try {
            const questionId = Number(req.params.questionId);
            if (Number.isNaN(questionId)) {
                return res.status(400).json({ error: "ID de pregunta inválido" });
            }
            await this.useCase.sendToReview(questionId);
            return res.status(200).json({
                message: "Pregunta enviada a revisión exitosamente",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al enviar a revisión",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al enviar a revisión" });
        }
    }
    async publishQuestion(req, res) {
        try {
            const questionId = Number(req.params.questionId);
            if (Number.isNaN(questionId)) {
                return res.status(400).json({ error: "ID de pregunta inválido" });
            }
            await this.useCase.publishQuestion(questionId);
            return res.status(200).json({
                message: "Pregunta publicada exitosamente",
            });
        }
        catch (error) {
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
