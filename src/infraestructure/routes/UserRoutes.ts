import { Router } from "express";
import { UserController } from "../controller/UserController.js";
import { UserUseCase } from "../../application/use-cases/UserUseCase.js";
import { UserAdapter } from "../adapter/UserAdapter.js";
import { authenticateToken } from "../web/authMiddleware.js";

const router = Router();

const userAdapter = new UserAdapter();
const userUseCase = new UserUseCase(userAdapter);
const userController = new UserController(userUseCase);

router.post("/users", async (req, res, next) => {
  try {
    await userController.createUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/users", authenticateToken, async (req, res, next) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/users/email/:email", authenticateToken, async (req, res, next) => {
  try {
    await userController.getUserByEmail(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id", authenticateToken, async (req, res, next) => {
  try {
    await userController.updateUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", authenticateToken, async (req, res, next) => {
  try {
    await userController.deleteUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    await userController.login(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
