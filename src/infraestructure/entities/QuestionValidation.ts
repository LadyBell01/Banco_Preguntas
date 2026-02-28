import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Question } from "./Question.js";
import { User } from "./User.js";

export enum ValidationResultEnum {
  APROBADA = "Aprobada",
  RECHAZADA = "Rechazada",
}

@Entity("question_validation")
export class QuestionValidation {
  @PrimaryGeneratedColumn()
  id_validation!: number;

  @Column({ type: "integer" })
  question_id!: number;

  @Column({ type: "integer" })
  validator_id!: number;

  @Column({
    type: "enum",
    enum: ValidationResultEnum,
  })
  result_validation!: ValidationResultEnum;

  @Column({ type: "text" })
  observations_validation!: string;

  @CreateDateColumn({ type: "timestamp" })
  validated_at!: Date;

  @ManyToOne(() => Question)
  @JoinColumn({ name: "question_id" })
  question!: Question;

  @ManyToOne(() => User)
  @JoinColumn({ name: "validator_id" })
  validator!: User;
}
