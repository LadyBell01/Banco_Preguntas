import { Router } from 'express';
import { CategoryAdapter } from '../adapter/CategoryAdapter.js';
import { CategoryUseCase } from '../../application/use-cases/CategoryUseCase.js';
import { CategoryController } from '../controller/CategoryController.js';
import { authenticateToken } from '../web/authMiddleware.js';

const router = Router();

// Init dependencies
const categoryAdapter = new CategoryAdapter();
const categoryUseCase = new CategoryUseCase(categoryAdapter);
const categoryController = new CategoryController(categoryUseCase);

// Routes
router.post('/', authenticateToken, categoryController.createCategory.bind(categoryController));
router.get('/', authenticateToken, categoryController.getCategories.bind(categoryController));
router.get('/:id', authenticateToken, categoryController.getCategoryById.bind(categoryController));
router.put('/:id', authenticateToken, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', authenticateToken, categoryController.deleteCategory.bind(categoryController));

export default router;
