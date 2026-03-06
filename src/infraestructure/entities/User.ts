import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRoleEnum {
  ADMIN = "Admin",
  DOCENTE = "Docente",
  DOCENTE_EXPERTO = "DocenteExperto",
}

@Entity("users")
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  nombre!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  email!: string;

  @Column({ type: "text" })
  password_hash!: string;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @Column({ type: "timestamptz" })
  created_at!: Date;

  @Column({ type: "timestamptz" })
  updated_at!: Date;
}