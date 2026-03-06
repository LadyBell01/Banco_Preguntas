import { Repository } from "typeorm";
import { User as UserDomain, UserRole } from "../../domain/entities/User.js";
import { User as UserEntity, UserRoleEnum } from "../entities/User.js";
import { UserPort } from "../../domain/ports/UserPort.js";
import { AppDataSource } from "../config/data-base.js";

export class UserAdapter implements UserPort {
  private userRepository: Repository<UserEntity>

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  private toDomain(user: UserEntity): UserDomain {
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

  private toEntity(user: Omit<UserDomain, "id" | "created_at" | "updated_at">): UserEntity {
    const userEntity = new UserEntity();
    userEntity.nombre = user.nombre;
    userEntity.email = user.email;
    userEntity.password_hash = user.password_hash;
    userEntity.activo = user.activo;
    return userEntity;
  }

  async createUser(user: Omit<UserDomain, "id" | "created_at" | "updated_at">): Promise<number> {
    try {
      const newUser = this.toEntity(user);
      const savedUser = await this.userRepository.save(newUser);
      return savedUser.id;
    } catch (error) {
      console.error("Error creando usuario:", error);
      throw new Error("Error al crear usuario");
    }
  }

  async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
  try {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) return false;

    Object.assign(existingUser, {
      nombre: user.nombre ?? existingUser.nombre,
      email: user.email ?? existingUser.email,
      password_hash: user.password_hash ?? existingUser.password_hash,
      activo: user.activo ?? existingUser.activo,
    });

      await this.userRepository.save(existingUser);
      return true;
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      throw new Error("Error actualizando usuario");
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { id: id } });
      if (!existingUser) return false;

      // Actualizar solo el estatus a 0 baja
      Object.assign(existingUser, {
        status_user: 0
      });

      await this.userRepository.save(existingUser);
      return true;

    } catch (error) {
      console.error("Error al dar de baja el usuario:", error);
      throw new Error("Error al dar de baja usuario");
    }
  }

  async getUserById(id: number): Promise<UserDomain | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      return user ? this.toDomain(user) : null;
    } catch (error) {
      console.error("Error obteniendo usuario por ID:", error);
      throw new Error("Error obteniendo usuario");
    }
  }

  async getUserByEmail(email: string): Promise<UserDomain | null> {
  const normalizedEmail = email.toLowerCase();

  const user = await this.userRepository.findOne({
    where: { email: normalizedEmail }
    });

    if (!user) return null;

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

  async getAllUsers(): Promise<UserDomain[]> {
    try {
      const users = await this.userRepository.find();
      return users.map(this.toDomain);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
      throw new Error("Error obteniendo lista de usuarios");
    }
  }
}
