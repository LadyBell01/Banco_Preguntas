import { Question } from "../entities/Question.js";

export interface QuestionPort {
  createQuestion(question: Omit<Question, "id">): Promise<number>;
  updateQuestion(id: number, question: Partial<Question>): Promise<boolean>;
  deleteQuestion(id: number): Promise<boolean>;
  getQuestionById(id: number): Promise<Question | null>;
  getQuestionsByCategory(categoryId: number): Promise<Question[]>;
  getQuestionsByDifficulty(difficulty: string): Promise<Question[]>;
  getQuestionsByStatus(status: string): Promise<Question[]>;
  getAllQuestions(): Promise<Question[]>;
}
