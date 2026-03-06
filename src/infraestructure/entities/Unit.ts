import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course.js";

@Entity("units")
export class Unit {
  @PrimaryGeneratedColumn()
  id_units!: number;

  @Column({ type: "character varying", length: 255 })
  name_unit!: string;

  @Column({ type: "text", nullable: true })
  description_unit!: string;

  @Column({ type: "integer" })
  courseId!: number;

  @Column({ type: "integer", default: 1 })
  status_unit!: number;

  @ManyToOne(() => Course, (course) => course.units)
  @JoinColumn({ name: "courseId" })
  course!: Course;
}
