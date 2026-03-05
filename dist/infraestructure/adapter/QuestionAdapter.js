import { Question as QuestionEntity } from "../entities/Question.js";
import { AppDataSource } from "../config/data-base.js";
export class QuestionAdapter {
    questionRepository;
    constructor() {
        this.questionRepository = AppDataSource.getRepository(QuestionEntity);
    }
    toDomain(question) {
        return {
            id: question.id_question,
            statement: question.statement_question,
            difficulty: question.difficulty_question,
            categoryId: question.category_id,
            status: question.status_question,
            active: question.active_question,
        };
    }
    toEntity(question) {
        const questionEntity = new QuestionEntity();
        questionEntity.statement_question = question.statement;
        questionEntity.difficulty_question = question.difficulty;
        questionEntity.category_id = question.categoryId;
        questionEntity.status_question = question.status;
        questionEntity.active_question = question.active;
        return questionEntity;
    }
    async createQuestion(question) {
        try {
            const newQuestion = this.toEntity(question);
            const savedQuestion = await this.questionRepository.save(newQuestion);
            return savedQuestion.id_question;
        }
        catch (error) {
            console.error("Error creando pregunta:", error);
            throw new Error("Error al crear pregunta");
        }
    }
    async updateQuestion(id, question) {
        try {
            const existingQuestion = await this.questionRepository.findOne({
                where: { id_question: id },
            });
            if (!existingQuestion)
                return false;
            Object.assign(existingQuestion, {
                statement_question: question.statement ?? existingQuestion.statement_question,
                difficulty_question: question.difficulty ?? existingQuestion.difficulty_question,
                category_id: question.categoryId ?? existingQuestion.category_id,
                status_question: question.status ?? existingQuestion.status_question,
                active_question: question.active ?? existingQuestion.active_question,
            });
            await this.questionRepository.save(existingQuestion);
            return true;
        }
        catch (error) {
            console.error("Error actualizando pregunta:", error);
            throw new Error("Error actualizando pregunta");
        }
    }
    async deleteQuestion(id) {
        try {
            const existingQuestion = await this.questionRepository.findOne({
                where: { id_question: id },
            });
            if (!existingQuestion)
                return false;
            existingQuestion.active_question = 0;
            await this.questionRepository.save(existingQuestion);
            return true;
        }
        catch (error) {
            console.error("Error al dar de baja la pregunta:", error);
            throw new Error("Error al dar de baja pregunta");
        }
    }
    async getQuestionById(id) {
        try {
            const question = await this.questionRepository.findOne({
                where: { id_question: id },
            });
            return question ? this.toDomain(question) : null;
        }
        catch (error) {
            console.error("Error obteniendo pregunta por ID:", error);
            throw new Error("Error obteniendo pregunta");
        }
    }
    async getQuestionsByCategory(categoryId) {
        try {
            const questions = await this.questionRepository.find({
                where: { category_id: categoryId, active_question: 1 },
            });
            return questions.map((q) => this.toDomain(q));
        }
        catch (error) {
            console.error("Error obteniendo preguntas por categoría:", error);
            throw new Error("Error obteniendo preguntas de la categoría");
        }
    }
    async getQuestionsByDifficulty(difficulty) {
        try {
            const questions = await this.questionRepository.find({
                where: { difficulty_question: difficulty, active_question: 1 },
            });
            return questions.map((q) => this.toDomain(q));
        }
        catch (error) {
            console.error("Error obteniendo preguntas por dificultad:", error);
            throw new Error("Error obteniendo preguntas por dificultad");
        }
    }
    async getQuestionsByStatus(status) {
        try {
            const questions = await this.questionRepository.find({
                where: { status_question: status, active_question: 1 },
            });
            return questions.map((q) => this.toDomain(q));
        }
        catch (error) {
            console.error("Error obteniendo preguntas por estado:", error);
            throw new Error("Error obteniendo preguntas por estado");
        }
    }
    async getAllQuestions() {
        try {
            const questions = await this.questionRepository.find({
                where: { active_question: 1 },
            });
            return questions.map((q) => this.toDomain(q));
        }
        catch (error) {
            console.error("Error obteniendo preguntas:", error);
            throw new Error("Error obteniendo lista de preguntas");
        }
    }
}
