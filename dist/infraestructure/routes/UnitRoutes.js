import { Router } from 'express';
import { UnitAdapter } from '../adapter/UnitAdapter.js';
import { CourseAdapter } from '../adapter/CourseAdapter.js';
import { UnitUseCase } from '../../application/use-cases/UnitUseCase.js';
import { UnitController } from '../controller/UnitController.js';
import { authenticateToken } from '../web/authMiddleware.js';
const router = Router();
// Init dependencies
const unitAdapter = new UnitAdapter();
const courseAdapter = new CourseAdapter();
const unitUseCase = new UnitUseCase(unitAdapter, courseAdapter);
const unitController = new UnitController(unitUseCase);
// Routes
router.post('/', authenticateToken, unitController.createUnit.bind(unitController));
router.get('/', authenticateToken, unitController.getUnits.bind(unitController));
router.get('/:id', authenticateToken, unitController.getUnitById.bind(unitController));
router.get('/course/:courseId', authenticateToken, unitController.getUnitsByCourse.bind(unitController));
router.put('/:id', authenticateToken, unitController.updateUnit.bind(unitController));
router.delete('/:id', authenticateToken, unitController.deleteUnit.bind(unitController));
export default router;
