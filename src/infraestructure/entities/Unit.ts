import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course.js";

@Entity("unit")
export class Unit {
  @PrimaryGeneratedColumn()
  id_unit!: number;

  @Column({ type: "character varying", length: 255 })
  name_unit!: string;

  @Column({ type: "text", nullable: true })
  description_unit!: string;

  @Column({ type: "integer" })
  course_id!: number;

  @Column({ type: "integer", default: 1 })
  status_unit!: number;

  @ManyToOne(() => Course, (course) => course.units)
  @JoinColumn({ name: "course_id" })
  course!: Course;
}
