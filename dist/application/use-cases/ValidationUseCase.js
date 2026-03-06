import { ValidationResult, QuestionStatus, UserRole } from "../../domain/entities/index.js";
export class ValidationUseCase {
    validationPort;
    questionPort;
    userPort;
    constructor(validationPort, questionPort, userPort) {
        this.validationPort = validationPort;
        this.questionPort = questionPort;
        this.userPort = userPort;
    }
    async validateQuestion(data) {
        const question = await this.questionPort.getQuestionById(data.questionId);
        if (!question) {
            throw new Error("La pregunta no existe");
        }
        if (question.active === 0) {
            throw new Error("No se puede validar una pregunta dada de baja");
        }
        if (question.status !== QuestionStatus.REVISION) {
            throw new Error("Solo se pueden validar preguntas en estado 'Revisión'");
        }
        const validator = await this.userPort.getUserById(data.validatorId);
        if (!validator) {
            throw new Error("El validador no existe");
        }
        if (validator.role !== UserRole.DOCENTE_EXPERTO && validator.role !== UserRole.ADMIN) {
            throw new Error("Solo los Docentes Expertos o Administradores pueden validar preguntas");
        }
        if (!data.observations || data.observations.trim().length < 10) {
            throw new Error("Las observaciones deben tener al menos 10 caracteres");
        }
        const validationId = await this.validationPort.createValidation({
            questionId: data.questionId,
            validatorId: data.validatorId,
            result: data.result,
            observations: data.observations.trim(),
        });
        const newStatus = data.result === ValidationResult.APROBADA
            ? QuestionStatus.APROBADA
            : QuestionStatus.RECHAZADA;
        await this.questionPort.updateQuestion(data.questionId, { status: newStatus });
        return validationId;
    }
    async getValidationHistory(questionId) {
        const question = await this.questionPort.getQuestionById(questionId);
        if (!question) {
            throw new Error("La pregunta no existe");
        }
        const validations = await this.validationPort.getValidationsByQuestionId(questionId);
        const validationsWithDetails = [];
        for (const validation of validations) {
            const validator = await this.userPort.getUserById(validation.validatorId);
            validationsWithDetails.push({
                ...validation,
                questionStatement: question.statement,
                validatorName: validator?.name || "Desconocido",
            });
        }
        return validationsWithDetails;
    }
    async getMyValidations(validatorId) {
        const validations = await this.validationPort.getValidationsByValidatorId(validatorId);
        const validationsWithDetails = [];
        for (const validation of validations) {
            const question = await this.questionPort.getQuestionById(validation.questionId);
            validationsWithDetails.push({
                ...validation,
                questionStatement: question?.statement || "Pregunta eliminada",
            });
        }
        return validationsWithDetails;
    }
    async sendToReview(questionId) {
        const question = await this.questionPort.getQuestionById(questionId);
        if (!question) {
            throw new Error("La pregunta no existe");
        }
        if (question.status !== QuestionStatus.BORRADOR && question.status !== QuestionStatus.RECHAZADA) {
            throw new Error("Solo se pueden enviar a revisión preguntas en estado 'Borrador' o 'Rechazada'");
        }
        return await this.questionPort.updateQuestion(questionId, {
            status: QuestionStatus.REVISION,
        });
    }
    async publishQuestion(questionId) {
        const question = await this.questionPort.getQuestionById(questionId);
        if (!question) {
            throw new Error("La pregunta no existe");
        }
        if (question.status !== QuestionStatus.APROBADA) {
            throw new Error("Solo se pueden publicar preguntas en estado 'Aprobada'");
        }
        return await this.questionPort.updateQuestion(questionId, {
            status: QuestionStatus.PUBLICADA,
        });
    }
}
