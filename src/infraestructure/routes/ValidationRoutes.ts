import { Router } from 'express';
import { QuestionValidationAdapter } from '../adapter/QuestionValidationAdapter.js';
import { ValidationUseCase } from '../../application/use-cases/ValidationUseCase.js';
import { ValidationController } from '../controller/ValidationController.js';
import { QuestionAdapter } from '../adapter/QuestionAdapter.js';
import { authenticateToken } from '../web/authMiddleware.js';
// Assuming roleMiddleware will check if user has required roles.
// We import a mock version or the actual one depending on implementation.
import { requireExpertRole } from '../web/roleMiddleware.js';

const router = Router();

// Init dependencies
const validationAdapter = new QuestionValidationAdapter();
const questionAdapter = new QuestionAdapter();
const validationUseCase = new ValidationUseCase(validationAdapter, questionAdapter);
const validationController = new ValidationController(validationUseCase);

// Routes
// POST /validations - Validar pregunta (JWT + DocenteExperto)
router.post(
  '/',
  authenticateToken,
  requireExpertRole,
  validationController.validateQuestion.bind(validationController)
);

// GET /validations/question/:questionId - Historial de validaciones de pregunta (JWT)
router.get(
  '/question/:questionId',
  authenticateToken,
  validationController.getValidationsByQuestion.bind(validationController)
);

// GET /validations/my-validations - Mis validaciones (JWT + DocenteExperto)
router.get(
  '/my-validations',
  authenticateToken,
  requireExpertRole,
  validationController.getMyValidations.bind(validationController)
);

export default router;
