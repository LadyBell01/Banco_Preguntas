import express from "express";
import userRoutes from "../routes/UserRoutes.js";
class App {
    app;
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express.json());
    }
    routes() {
        this.app.use("/api", userRoutes);
    }
    getApp() {
        return this.app;
    }
}
export default new App().getApp();
