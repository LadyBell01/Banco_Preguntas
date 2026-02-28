import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRoleEnum {
  ADMIN = "Admin",
  DOCENTE = "Docente",
  DOCENTE_EXPERTO = "DocenteExperto",
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id_user!: number;

  @Column({ type: "character varying", length: 255 })
  name_user!: string;

  @Column({ type: "character varying", length: 255, unique: true })
  email_user!: string;

  @Column({ type: "character varying", length: 255 })
  password_user!: string;

  @Column({
    type: "enum",
    enum: UserRoleEnum,
    default: UserRoleEnum.DOCENTE,
  })
  role_user!: UserRoleEnum;

  @Column({ type: "integer", default: 1 })
  status_user!: number;
}