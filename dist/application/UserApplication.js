export class UserApplication {
    port;
    constructor(port) {
        this.port = port;
    }
    async createUser(user) {
        //Antes de crear un usuario debo validar : el email no existe
        const existUser = await this.port.getUserByEmail(user.email);
        if (existUser) {
            throw new Error("Este email ya está registrado");
        }
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
        return this.port.updateUser(id, user);
    }
    async deleteUser(id) {
        return await this.port.deleteUser(id);
    }
}
