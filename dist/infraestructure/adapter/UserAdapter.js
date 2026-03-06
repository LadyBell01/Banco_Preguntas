import { User as UserEntity } from "../entities/User.js";
import { AppDataSource } from "../config/data-base.js";
export class UserAdapter {
    userRepository;
    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }
    toDomain(user) {
        return {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            password_hash: user.password_hash,
            activo: user.activo,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    toEntity(user) {
        const userEntity = new UserEntity();
        userEntity.nombre = user.nombre;
        userEntity.email = user.email;
        userEntity.password_hash = user.password_hash;
        userEntity.activo = user.activo;
        return userEntity;
    }
    async createUser(user) {
        try {
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.id;
        }
        catch (error) {
            console.error("Error creando usuario:", error);
            throw new Error("Error al crear usuario");
        }
    }
    async updateUser(id, user) {
        try {
            const existingUser = await this.userRepository.findOne({ where: { id } });
            if (!existingUser)
                return false;
            Object.assign(existingUser, {
                nombre: user.nombre ?? existingUser.nombre,
                email: user.email ?? existingUser.email,
                password_hash: user.password_hash ?? existingUser.password_hash,
                activo: user.activo ?? existingUser.activo,
            });
            await this.userRepository.save(existingUser);
            return true;
        }
        catch (error) {
            console.error("Error actualizando usuario:", error);
            throw new Error("Error actualizando usuario");
        }
    }
    async deleteUser(id) {
        try {
            const existingUser = await this.userRepository.findOne({ where: { id: id } });
            if (!existingUser)
                return false;
            // Actualizar solo el estatus a 0 baja
            Object.assign(existingUser, {
                status_user: 0
            });
            await this.userRepository.save(existingUser);
            return true;
        }
        catch (error) {
            console.error("Error al dar de baja el usuario:", error);
            throw new Error("Error al dar de baja usuario");
        }
    }
    async getUserById(id) {
        try {
            const user = await this.userRepository.findOne({ where: { id: id } });
            return user ? this.toDomain(user) : null;
        }
        catch (error) {
            console.error("Error obteniendo usuario por ID:", error);
            throw new Error("Error obteniendo usuario");
        }
    }
    async getUserByEmail(email) {
        const normalizedEmail = email.toLowerCase();
        const user = await this.userRepository.findOne({
            where: { email: normalizedEmail }
        });
        if (!user)
            return null;
        return {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            password_hash: user.password_hash,
            activo: user.activo,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    }
    async getAllUsers() {
        try {
            const users = await this.userRepository.find();
            return users.map(this.toDomain);
        }
        catch (error) {
            console.error("Error obteniendo usuarios:", error);
            throw new Error("Error obteniendo lista de usuarios");
        }
    }
}
