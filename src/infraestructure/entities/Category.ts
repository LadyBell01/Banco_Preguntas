import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Question } from "./Question.js";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id_categories!: number;

  @Column({ type: "character varying", length: 255 })
  name_category!: string;

  @Column({ type: "text", nullable: true })
  description_category!: string;

  @Column({ type: "integer", default: 1 })
  status_category!: number;

  @OneToMany(() => Question, (question) => question.category)
  questions!: Question[];
}
