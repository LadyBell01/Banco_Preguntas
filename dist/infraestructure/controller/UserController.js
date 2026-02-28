import { loadUserData } from "../Util/user-validation.js";
export class UserController {
    app;
    constructor(application) {
        this.app = application;
    }
    async createUser(req, res) {
        try {
            //Validar los datos de entrada
            const { name, email, password, status } = loadUserData(req.body);
            // Crear usuario
            const user = { name, email, password, status };
            const userId = await this.app.createUser(user);
            return res
                .status(201)
                .json({ message: "Usuario creado con éxito", userId });
        }
        catch (error) {
            if (error instanceof Error) {
                return res
                    .status(500)
                    .json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async updateUser(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" }); // Añadido el punto antes de json
            }
            const dataLoad = loadUserData(req.body);
            const updated = await this.app.updateUser(id, dataLoad);
            return res.status(200).json({ message: "Usuario actualizado", updated });
        }
        catch (error) {
            return res.status(500).json({ error: "Error al actualizar" });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.app.getAllUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener usuarios" });
        }
    }
    async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await this.app.getUserByEmail("email");
            if (!user)
                return res.status(404).json({ message: "No encontrado" });
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al buscar" });
        }
    }
    async deleteUser(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            // Llama al método deleteUser que ya tienes en UserApplication
            await this.app.deleteUser(id);
            return res.status(200).json({ message: "Usuario eliminado con éxito" });
        }
        catch (error) {
            return res.status(500).json({
                message: "Error al eliminar el usuario",
                error: error.message
            });
        }
    }
}
