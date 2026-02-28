import { Router } from "express";
import { QuestionController } from "../controller/QuestionController.js";
import { QuestionUseCase } from "../../application/use-cases/QuestionUseCase.js";
import { QuestionAdapter } from "../adapter/QuestionAdapter.js";
import { OptionAdapter } from "../adapter/OptionAdapter.js";
import { CategoryAdapter } from "../adapter/CategoryAdapter.js";
import { authenticateToken } from "../web/authMiddleware.js";

const router = Router();

const questionAdapter = new QuestionAdapter();
const optionAdapter = new OptionAdapter();
const categoryAdapter = new CategoryAdapter();
const questionUseCase = new QuestionUseCase(questionAdapter, optionAdapter, categoryAdapter);
const questionController = new QuestionController(questionUseCase);

router.post("/questions", authenticateToken, async (req, res, next) => {
  try {
    await questionController.createQuestion(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/questions", authenticateToken, async (req, res, next) => {
  try {
    await questionController.getAllQuestions(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/questions/:id", authenticateToken, async (req, res, next) => {
  try {
    await questionController.getQuestionById(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/questions/category/:categoryId", authenticateToken, async (req, res, next) => {
  try {
    await questionController.getQuestionsByCategory(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/questions/difficulty/:difficulty", authenticateToken, async (req, res, next) => {
  try {
    await questionController.getQuestionsByDifficulty(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/questions/status/:status", authenticateToken, async (req, res, next) => {
  try {
    await questionController.getQuestionsByStatus(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/questions/:id", authenticateToken, async (req, res, next) => {
  try {
    await questionController.updateQuestion(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/questions/:id/options", authenticateToken, async (req, res, next) => {
  try {
    await questionController.updateQuestionOptions(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/questions/:id", authenticateToken, async (req, res, next) => {
  try {
    await questionController.deleteQuestion(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
