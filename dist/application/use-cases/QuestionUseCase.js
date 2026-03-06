import { QuestionStatus } from "../../domain/entities/index.js";
export class QuestionUseCase {
    questionPort;
    optionPort;
    categoryPort;
    constructor(questionPort, optionPort, categoryPort) {
        this.questionPort = questionPort;
        this.optionPort = optionPort;
        this.categoryPort = categoryPort;
    }
    async createQuestionWithOptions(data) {
        const category = await this.categoryPort.getCategoryById(data.category_id);
        if (!category) {
            throw new Error("La categoría especificada no existe");
        }
        if (!data.options || data.options.length < 2) {
            throw new Error("La pregunta debe tener al menos 2 opciones");
        }
        const correctOptions = data.options.filter((opt) => opt.isCorrect);
        if (correctOptions.length === 0) {
            throw new Error("Debe haber al menos una opción correcta");
        }
        if (correctOptions.length > 1) {
            throw new Error("Solo puede haber una opción correcta por pregunta");
        }
        const questionData = {
            statement: data.statement,
            difficulty: data.difficulty,
            category_id: data.category_id,
            status: data.status || QuestionStatus.BORRADOR,
            active: 1,
        };
        const questionId = await this.questionPort.createQuestion(questionData);
        const optionsData = data.options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            question_id: questionId,
            active: 1,
        }));
        await this.optionPort.createOptions(optionsData);
        return questionId;
    }
    async getQuestionById(id) {
        return await this.questionPort.getQuestionById(id);
    }
    async getQuestionWithOptions(id) {
        const question = await this.questionPort.getQuestionById(id);
        if (!question)
            return null;
        const options = await this.optionPort.getOptionsByQuestionId(id);
        return { ...question, options };
    }
    async getAllQuestions() {
        return await this.questionPort.getAllQuestions();
    }
    async getAllQuestionsWithOptions() {
        const questions = await this.questionPort.getAllQuestions();
        const questionsWithOptions = [];
        for (const question of questions) {
            const options = await this.optionPort.getOptionsByQuestionId(question.id_questions);
            questionsWithOptions.push({ ...question, options });
        }
        return questionsWithOptions;
    }
    async getQuestionsByCategory(categoryId) {
        const category = await this.categoryPort.getCategoryById(categoryId);
        if (!category) {
            throw new Error("La categoría especificada no existe");
        }
        const questions = await this.questionPort.getQuestionsByCategory(categoryId);
        const questionsWithOptions = [];
        for (const question of questions) {
            const options = await this.optionPort.getOptionsByQuestionId(question.id_questions);
            questionsWithOptions.push({ ...question, options });
        }
        return questionsWithOptions;
    }
    async getQuestionsByDifficulty(difficulty) {
        const questions = await this.questionPort.getQuestionsByDifficulty(difficulty);
        const questionsWithOptions = [];
        for (const question of questions) {
            const options = await this.optionPort.getOptionsByQuestionId(question.id_questions);
            questionsWithOptions.push({ ...question, options });
        }
        return questionsWithOptions;
    }
    async getQuestionsByStatus(status) {
        const questions = await this.questionPort.getQuestionsByStatus(status);
        const questionsWithOptions = [];
        for (const question of questions) {
            const options = await this.optionPort.getOptionsByQuestionId(question.id_questions);
            questionsWithOptions.push({ ...question, options });
        }
        return questionsWithOptions;
    }
    async updateQuestion(id, data) {
        const existingQuestion = await this.questionPort.getQuestionById(id);
        if (!existingQuestion) {
            throw new Error("Pregunta no encontrada");
        }
        if (data.category_id) {
            const category = await this.categoryPort.getCategoryById(data.category_id);
            if (!category) {
                throw new Error("La categoría especificada no existe");
            }
        }
        return await this.questionPort.updateQuestion(id, data);
    }
    async updateQuestionStatus(id, status) {
        const existingQuestion = await this.questionPort.getQuestionById(id);
        if (!existingQuestion) {
            throw new Error("Pregunta no encontrada");
        }
        return await this.questionPort.updateQuestion(id, { status });
    }
    async updateQuestionOptions(questionId, options) {
        const existingQuestion = await this.questionPort.getQuestionById(questionId);
        if (!existingQuestion) {
            throw new Error("Pregunta no encontrada");
        }
        if (!options || options.length < 2) {
            throw new Error("La pregunta debe tener al menos 2 opciones");
        }
        const correctOptions = options.filter((opt) => opt.isCorrect);
        if (correctOptions.length === 0) {
            throw new Error("Debe haber al menos una opción correcta");
        }
        if (correctOptions.length > 1) {
            throw new Error("Solo puede haber una opción correcta por pregunta");
        }
        await this.optionPort.deleteOptionsByQuestionId(questionId);
        const optionsData = options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            question_id: questionId,
            active: 1,
        }));
        await this.optionPort.createOptions(optionsData);
        return true;
    }
    async deleteQuestion(id) {
        const existingQuestion = await this.questionPort.getQuestionById(id);
        if (!existingQuestion) {
            throw new Error("Pregunta no encontrada");
        }
        await this.optionPort.deleteOptionsByQuestionId(id);
        return await this.questionPort.deleteQuestion(id);
    }
}
