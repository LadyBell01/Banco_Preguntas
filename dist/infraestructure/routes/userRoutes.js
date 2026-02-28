import { Router } from "express";
import { UserController } from "../controller/UserController.js";
import { UserApplication } from "../../application/UserApplication.js";
import { UserAdapter } from "../adapter/UserAdapter.js";
const router = Router();
// Inicialización de las capas
const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter);
const userController = new UserController(userApp);
//definición de las rutas
router.post("/users", async (req, res) => {
    try {
        await userController.createUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error en la creación de usuario", error });
    }
});
router.get("/users", async (req, res) => {
    try {
        await userController.getAllUsers(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error en la consulta de datos", error });
    }
});
router.get("/users/email/:email", async (req, res) => {
    try {
        await userController.getUserByEmail(req, res);
    }
    catch (error) {
        await userController.getUserByEmail(req, res);
        res.status(500).json({ message: "Error en la consulta de datos", error });
    }
});
router.put("/users/:id", async (req, res) => {
    try {
        await userController.updateUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error en la actualización", error });
    }
});
router.delete("/users/:id", async (req, res) => {
    try {
        await userController.deleteUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error });
    }
});
export default router;
