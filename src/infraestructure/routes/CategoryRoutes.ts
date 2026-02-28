import { Router } from "express";
import { CategoryController } from "../controller/CategoryController.js";
import { CategoryUseCase } from "../../application/use-cases/CategoryUseCase.js";
import { CategoryAdapter } from "../adapter/CategoryAdapter.js";
import { authenticateToken } from "../web/authMiddleware.js";

const router = Router();

const categoryAdapter = new CategoryAdapter();
const categoryUseCase = new CategoryUseCase(categoryAdapter);
const categoryController = new CategoryController(categoryUseCase);

router.post("/categories", authenticateToken, async (req, res, next) => {
  try {
    await categoryController.createCategory(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/categories", authenticateToken, async (req, res, next) => {
  try {
    await categoryController.getAllCategories(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/categories/:id", authenticateToken, async (req, res, next) => {
  try {
    await categoryController.getCategoryById(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/categories/:id", authenticateToken, async (req, res, next) => {
  try {
    await categoryController.updateCategory(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/categories/:id", authenticateToken, async (req, res, next) => {
  try {
    await categoryController.deleteCategory(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
