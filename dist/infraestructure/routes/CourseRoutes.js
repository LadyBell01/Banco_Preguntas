import { Router } from 'express';
import { CourseAdapter } from '../adapter/CourseAdapter.js';
import { CourseUseCase } from '../../application/use-cases/CourseUseCase.js';
import { CourseController } from '../controller/CourseController.js';
import { authenticateToken } from '../web/authMiddleware.js';
const router = Router();
// Init dependencies
const courseAdapter = new CourseAdapter();
const courseUseCase = new CourseUseCase(courseAdapter);
const courseController = new CourseController(courseUseCase);
// Routes
router.post('/', authenticateToken, courseController.createCourse.bind(courseController));
router.get('/', authenticateToken, courseController.getCourses.bind(courseController));
router.get('/:id', authenticateToken, courseController.getCourseById.bind(courseController));
router.put('/:id', authenticateToken, courseController.updateCourse.bind(courseController));
router.delete('/:id', authenticateToken, courseController.deleteCourse.bind(courseController));
export default router;
