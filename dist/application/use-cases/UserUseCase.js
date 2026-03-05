import { AuthUseCase } from "./AuthUseCase.js";
import bcrypt from "bcryptjs";
export class UserUseCase {
    port;
    constructor(port) {
        this.port = port;
    }
    async login(email, password) {
        const existUser = await this.port.getUserByEmail(email);
        if (!existUser) {
            throw new Error("Credenciales Inválidas");
        }
        const passMatch = await bcrypt.compare(password, existUser.password);
        if (!passMatch) {
            throw new Error("Credenciales Inválidas");
        }
        const token = AuthUseCase.generateToken({
            id: existUser.id,
            email: existUser.email,
            role: existUser.role,
        });
        return token;
    }
    async createUser(user) {
        const existUser = await this.port.getUserByEmail(user.email);
        if (existUser) {
            throw new Error("Este email ya está registrado");
        }
        const hashedPassword = await bcrypt.hash(user.password, 12);
        user.password = hashedPassword;
        return this.port.createUser(user);
    }
    async getUserById(id) {
        return await this.port.getUserById(id);
    }
    async getUserByEmail(email) {
        return await this.port.getUserByEmail(email);
    }
    async getAllUsers() {
        return await this.port.getAllUsers();
    }
    async updateUser(id, user) {
        const existingUser = await this.port.getUserById(id);
        if (!existingUser) {
            throw new Error("Usuario no encontrado");
        }
        if (user.email) {
            const emailTaken = await this.port.getUserByEmail(user.email);
            if (emailTaken && emailTaken.id !== id) {
                throw new Error("El email ya está en uso");
            }
        }
        const dataToUpdate = { ...user };
        if (dataToUpdate.password) {
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 12);
        }
        return this.port.updateUser(id, dataToUpdate);
    }
    async deleteUser(id) {
        return await this.port.deleteUser(id);
    }
}
