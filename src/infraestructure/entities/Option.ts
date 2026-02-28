import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question.js";

@Entity("option")
export class Option {
  @PrimaryGeneratedColumn()
  id_option!: number;

  @Column({ type: "text" })
  text_option!: string;

  @Column({ type: "boolean", default: false })
  is_correct_option!: boolean;

  @Column({ type: "integer" })
  question_id!: number;

  @Column({ type: "integer", default: 1 })
  active_option!: number;

  @ManyToOne(() => Question, (question) => question.options)
  @JoinColumn({ name: "question_id" })
  question!: Question;
}
