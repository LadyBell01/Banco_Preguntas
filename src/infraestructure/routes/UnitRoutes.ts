import { Router } from "express";
import { UnitController } from "../controller/UnitController.js";
import { UnitUseCase } from "../../application/use-cases/UnitUseCase.js";
import { UnitAdapter } from "../adapter/UnitAdapter.js";
import { CourseAdapter } from "../adapter/CourseAdapter.js";
import { authenticateToken } from "../web/authMiddleware.js";

const router = Router();

const unitAdapter = new UnitAdapter();
const courseAdapter = new CourseAdapter();
const unitUseCase = new UnitUseCase(unitAdapter, courseAdapter);
const unitController = new UnitController(unitUseCase);

router.post("/units", authenticateToken, async (req, res, next) => {
  try {
    await unitController.createUnit(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/units", authenticateToken, async (req, res, next) => {
  try {
    await unitController.getAllUnits(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/units/:id", authenticateToken, async (req, res, next) => {
  try {
    await unitController.getUnitById(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/courses/:courseId/units", authenticateToken, async (req, res, next) => {
  try {
    await unitController.getUnitsByCourse(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/units/:id", authenticateToken, async (req, res, next) => {
  try {
    await unitController.updateUnit(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/units/:id", authenticateToken, async (req, res, next) => {
  try {
    await unitController.deleteUnit(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
