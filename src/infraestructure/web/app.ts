import express, { type Request, type Response } from "express";
import cors from "cors";
import userRoutes from "../routes/UserRoutes.js";
import categoryRoutes from "../routes/CategoryRoutes.js";
import courseRoutes from "../routes/CourseRoutes.js";
import unitRoutes from "../routes/UnitRoutes.js";
import questionRoutes from "../routes/QuestionRoutes.js";
import validationRoutes from "../routes/ValidationRoutes.js";
import { errorHandler, notFoundHandler } from "./errorMiddleware.js";

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandlers();
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use("/api", userRoutes);
    this.app.use("/api", categoryRoutes);
    this.app.use("/api", courseRoutes);
    this.app.use("/api", unitRoutes);
    this.app.use("/api", questionRoutes);
    this.app.use("/api", validationRoutes);
  }

  private errorHandlers(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  getApp() {
    return this.app;
  }
}

export default new App().getApp();
