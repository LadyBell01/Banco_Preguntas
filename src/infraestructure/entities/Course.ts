import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "./Unit.js";

@Entity("course")
export class Course {
  @PrimaryGeneratedColumn()
  id_course!: number;

  @Column({ type: "character varying", length: 255 })
  name_course!: string;

  @Column({ type: "text", nullable: true })
  description_course!: string;

  @Column({ type: "integer", default: 1 })
  status_course!: number;

  @OneToMany(() => Unit, (unit) => unit.course)
  units!: Unit[];
}
