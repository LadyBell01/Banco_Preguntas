import { Router } from "express";
import { CourseController } from "../controller/CourseController.js";
import { CourseUseCase } from "../../application/use-cases/CourseUseCase.js";
import { CourseAdapter } from "../adapter/CourseAdapter.js";
import { authenticateToken } from "../web/authMiddleware.js";

const router = Router();

const courseAdapter = new CourseAdapter();
const courseUseCase = new CourseUseCase(courseAdapter);
const courseController = new CourseController(courseUseCase);

router.post("/courses", authenticateToken, async (req, res, next) => {
  try {
    await courseController.createCourse(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/courses", authenticateToken, async (req, res, next) => {
  try {
    await courseController.getAllCourses(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/courses/:id", authenticateToken, async (req, res, next) => {
  try {
    await courseController.getCourseById(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/courses/:id", authenticateToken, async (req, res, next) => {
  try {
    await courseController.updateCourse(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/courses/:id", authenticateToken, async (req, res, next) => {
  try {
    await courseController.deleteCourse(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
