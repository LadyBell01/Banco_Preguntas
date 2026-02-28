import { Question, Difficulty, QuestionStatus, Option } from "../../domain/entities/index.js";
import { QuestionPort } from "../../domain/ports/QuestionPort.js";
import { OptionPort } from "../../domain/ports/OptionPort.js";
import { CategoryPort } from "../../domain/ports/CategoryPort.js";

export interface CreateQuestionWithOptionsDTO {
  statement: string;
  difficulty: Difficulty;
  categoryId: number;
  status?: QuestionStatus;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

export interface QuestionWithOptions extends Question {
  options: Option[];
}

export class QuestionUseCase {
  private questionPort: QuestionPort;
  private optionPort: OptionPort;
  private categoryPort: CategoryPort;

  constructor(
    questionPort: QuestionPort,
    optionPort: OptionPort,
    categoryPort: CategoryPort
  ) {
    this.questionPort = questionPort;
    this.optionPort = optionPort;
    this.categoryPort = categoryPort;
  }

  async createQuestionWithOptions(data: CreateQuestionWithOptionsDTO): Promise<number> {
    const category = await this.categoryPort.getCategoryById(data.categoryId);
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

    const questionData: Omit<Question, "id"> = {
      statement: data.statement,
      difficulty: data.difficulty,
      categoryId: data.categoryId,
      status: data.status || QuestionStatus.BORRADOR,
      active: 1,
    };

    const questionId = await this.questionPort.createQuestion(questionData);

    const optionsData: Omit<Option, "id">[] = data.options.map((opt) => ({
      text: opt.text,
      isCorrect: opt.isCorrect,
      questionId: questionId,
      active: 1,
    }));

    await this.optionPort.createOptions(optionsData);

    return questionId;
  }

  async getQuestionById(id: number): Promise<Question | null> {
    return await this.questionPort.getQuestionById(id);
  }

  async getQuestionWithOptions(id: number): Promise<QuestionWithOptions | null> {
    const question = await this.questionPort.getQuestionById(id);
    if (!question) return null;

    const options = await this.optionPort.getOptionsByQuestionId(id);
    return { ...question, options };
  }

  async getAllQuestions(): Promise<Question[]> {
    return await this.questionPort.getAllQuestions();
  }

  async getAllQuestionsWithOptions(): Promise<QuestionWithOptions[]> {
    const questions = await this.questionPort.getAllQuestions();
    const questionsWithOptions: QuestionWithOptions[] = [];

    for (const question of questions) {
      const options = await this.optionPort.getOptionsByQuestionId(question.id);
      questionsWithOptions.push({ ...question, options });
    }

    return questionsWithOptions;
  }

  async getQuestionsByCategory(categoryId: number): Promise<QuestionWithOptions[]> {
    const category = await this.categoryPort.getCategoryById(categoryId);
    if (!category) {
      throw new Error("La categoría especificada no existe");
    }

    const questions = await this.questionPort.getQuestionsByCategory(categoryId);
    const questionsWithOptions: QuestionWithOptions[] = [];

    for (const question of questions) {
      const options = await this.optionPort.getOptionsByQuestionId(question.id);
      questionsWithOptions.push({ ...question, options });
    }

    return questionsWithOptions;
  }

  async getQuestionsByDifficulty(difficulty: Difficulty): Promise<QuestionWithOptions[]> {
    const questions = await this.questionPort.getQuestionsByDifficulty(difficulty);
    const questionsWithOptions: QuestionWithOptions[] = [];

    for (const question of questions) {
      const options = await this.optionPort.getOptionsByQuestionId(question.id);
      questionsWithOptions.push({ ...question, options });
    }

    return questionsWithOptions;
  }

  async getQuestionsByStatus(status: QuestionStatus): Promise<QuestionWithOptions[]> {
    const questions = await this.questionPort.getQuestionsByStatus(status);
    const questionsWithOptions: QuestionWithOptions[] = [];

    for (const question of questions) {
      const options = await this.optionPort.getOptionsByQuestionId(question.id);
      questionsWithOptions.push({ ...question, options });
    }

    return questionsWithOptions;
  }

  async updateQuestion(id: number, data: Partial<Question>): Promise<boolean> {
    const existingQuestion = await this.questionPort.getQuestionById(id);
    if (!existingQuestion) {
      throw new Error("Pregunta no encontrada");
    }

    if (data.categoryId) {
      const category = await this.categoryPort.getCategoryById(data.categoryId);
      if (!category) {
        throw new Error("La categoría especificada no existe");
      }
    }

    return await this.questionPort.updateQuestion(id, data);
  }

  async updateQuestionStatus(id: number, status: QuestionStatus): Promise<boolean> {
    const existingQuestion = await this.questionPort.getQuestionById(id);
    if (!existingQuestion) {
      throw new Error("Pregunta no encontrada");
    }

    return await this.questionPort.updateQuestion(id, { status });
  }

  async updateQuestionOptions(
    questionId: number,
    options: { text: string; isCorrect: boolean }[]
  ): Promise<boolean> {
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

    const optionsData: Omit<Option, "id">[] = options.map((opt) => ({
      text: opt.text,
      isCorrect: opt.isCorrect,
      questionId: questionId,
      active: 1,
    }));

    await this.optionPort.createOptions(optionsData);
    return true;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    const existingQuestion = await this.questionPort.getQuestionById(id);
    if (!existingQuestion) {
      throw new Error("Pregunta no encontrada");
    }

    await this.optionPort.deleteOptionsByQuestionId(id);
    return await this.questionPort.deleteQuestion(id);
  }
}
