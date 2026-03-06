import { UserRole } from "../../domain/entities/User.js";
import { User as UserEntity } from "../entities/User.js";
import { AppDataSource } from "../config/data-base.js";
export class UserAdapter {
    userRepository;
    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }
    toDomain(user) {
        return {
            id_users: user.id_users,
            name: user.name_user,
            email: user.email_user,
            password: user.password_user,
            role: user.role_user,
            status: user.status_user
        };
    }
    toEntity(user) {
        const userEntity = new UserEntity();
        userEntity.name_user = user.name;
        userEntity.email_user = user.email;
        userEntity.password_user = user.password;
        userEntity.role_user = (user.role || UserRole.DOCENTE);
        userEntity.status_user = user.status;
        return userEntity;
    }
    async createUser(user) {
        try {
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.id_users;
        }
        catch (error) {
            console.error("Error creando usuario:", error);
            throw new Error("Error al crear usuario");
        }
    }
    async updateUser(id, user) {
        try {
            const existingUser = await this.userRepository.findOne({ where: { id_users: id } });
            if (!existingUser)
                return false;
            Object.assign(existingUser, {
                name_user: user.name ?? existingUser.name_user,
                email_user: user.email ?? existingUser.email_user,
                password_user: user.password ?? existingUser.password_user,
                role_user: user.role ?? existingUser.role_user,
                status_user: user.status ?? existingUser.status_user
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
            const existingUser = await this.userRepository.findOne({ where: { id_users: id } });
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
            const user = await this.userRepository.findOne({ where: { id_users: id } });
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
            where: { email_user: normalizedEmail }
        });
        if (!user)
            return null;
        return {
            id_users: user.id_users,
            name: user.name_user,
            email: user.email_user,
            password: user.password_user,
            role: user.role_user,
            status: user.status_user,
        };
    }
    async getAllUsers() {
        try {
            const users = await this.userRepository.find({ where: { status_user: 1 } });
            return users.map(this.toDomain);
        }
        catch (error) {
            console.error("Error obteniendo usuarios:", error);
            throw new Error("Error obteniendo lista de usuarios");
        }
    }
}
