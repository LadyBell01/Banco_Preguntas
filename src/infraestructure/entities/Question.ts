import { Column, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category.js";
import { Option } from "./Option.js";
import { QuestionValidation } from "./QuestionValidation.js";

export enum DifficultyEnum {
  BAJA = "Baja",
  MEDIA = "Media",
  ALTA = "Alta",
}

export enum QuestionStatusEnum {
  BORRADOR = "Borrador",
  REVISION = "Revisión",
  APROBADA = "Aprobada",
  RECHAZADA = "Rechazada",
  PUBLICADA = "Publicada",
}

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id_questions!: number;

  @Column({ type: "text" })
  statement_question!: string;

  @Column({
    type: "enum",
    enum: DifficultyEnum,
    default: DifficultyEnum.MEDIA,
  })
  difficulty_question!: DifficultyEnum;

  @Column({ type: "integer" })
  category_id!: number;

  @Column({
    type: "enum",
    enum: QuestionStatusEnum,
    default: QuestionStatusEnum.BORRADOR,
  })
  status_question!: QuestionStatusEnum;

  @Column({ type: "integer", default: 1 })
  active_question!: number;

  @ManyToOne(() => Category, (category) => category.questions)
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options!: Option[];

  @OneToMany(() => QuestionValidation, (validation) => validation.question, { cascade: true })
  validations!: QuestionValidation[];
}
