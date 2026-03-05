import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UnitEntity } from './Unit.js';
import { Course as ICourse } from '../../domain/entities/Course.js';

@Entity('courses')
export class CourseEntity implements ICourse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'int', default: 1 })
  status!: number;

  @OneToMany(() => UnitEntity, (unit) => unit.course)
  units?: UnitEntity[];
}
