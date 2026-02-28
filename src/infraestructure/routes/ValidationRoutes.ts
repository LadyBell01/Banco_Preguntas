import { Router } from "express";
import { ValidationController } from "../controller/ValidationController.js";
import { ValidationUseCase } from "../../application/use-cases/ValidationUseCase.js";
import { QuestionValidationAdapter } from "../adapter/QuestionValidationAdapter.js";
import { QuestionAdapter } from "../adapter/QuestionAdapter.js";
import { UserAdapter } from "../adapter/UserAdapter.js";
import { authenticateToken } from "../web/authMiddleware.js";
import { requireExpertRole } from "../web/roleMiddleware.js";

const router = Router();

const validationAdapter = new QuestionValidationAdapter();
const questionAdapter = new QuestionAdapter();
const userAdapter = new UserAdapter();
const validationUseCase = new ValidationUseCase(validationAdapter, questionAdapter, userAdapter);
const validationController = new ValidationController(validationUseCase);

router.post("/validations", authenticateToken, requireExpertRole, async (req, res, next) => {
  try {
    await validationController.validateQuestion(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.get("/validations/question/:questionId", authenticateToken, async (req, res, next) => {
  try {
    await validationController.getValidationHistory(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.get("/validations/my-validations", authenticateToken, requireExpertRole, async (req, res, next) => {
  try {
    await validationController.getMyValidations(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.patch("/questions/:questionId/send-to-review", authenticateToken, async (req, res, next) => {
  try {
    await validationController.sendToReview(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.patch("/questions/:questionId/publish", authenticateToken, requireExpertRole, async (req, res, next) => {
  try {
    await validationController.publishQuestion(req as any, res);
  } catch (error) {
    next(error);
  }
});

export default router;
