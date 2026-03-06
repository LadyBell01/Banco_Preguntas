import { loadUserData } from "../Util/user-validation.js";
import { loadUpdateUserData } from "../Util/user-update-validation.js";
export class UserController {
    useCase;
    constructor(useCase) {
        this.useCase = useCase;
    }
    async createUser(req, res) {
        try {
            const { name, email, password, role, status } = loadUserData(req.body);
            const user = {
                name,
                email,
                password,
                role: (role || "Docente"),
                status,
            };
            const userId = await this.useCase.createUser(user);
            return res
                .status(201)
                .json({ message: "Usuario creado con éxito", userId });
        }
        catch (error) {
            if (error instanceof Error) {
                return res
                    .status(400)
                    .json({
                    error: "Error al crear usuario",
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
                return res.status(400).json({ error: "ID inválido" });
            }
            const dataLoad = loadUpdateUserData(req.body);
            const updated = await this.useCase.updateUser(id, {
                ...dataLoad,
                role: dataLoad.role,
            });
            return res.status(200).json({ message: "Usuario actualizado", updated });
        }
        catch (error) {
            return res.status(500).json({ error: "Error al actualizar" });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.useCase.getAllUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener usuarios" });
        }
    }
    async getUserByEmail(req, res) {
        try {
            const emailParam = req.params.email;
            if (typeof emailParam !== "string") {
                return res.status(400).json({ error: "Email inválido" });
            }
            const user = await this.useCase.getUserByEmail(emailParam);
            if (!user) {
                return res.status(404).json({ message: "No encontrado" });
            }
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
            await this.useCase.deleteUser(id);
            return res.status(200).json({ message: "Usuario eliminado con éxito" });
        }
        catch (error) {
            return res.status(500).json({
                message: "Error al eliminar el usuario",
                error: error.message
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    error: "Email y contraseña requeridos"
                });
            }
            const token = await this.useCase.login(email, password);
            return res.status(200).json({ message: "Login éxito", token });
        }
        catch (error) {
            return res.status(401).json({ error: "Credenciales Inválidas" });
        }
    }
}
