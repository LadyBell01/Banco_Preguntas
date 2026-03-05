import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CourseEntity } from './Course.js';
import { Unit as IUnit } from '../../domain/entities/Unit.js';

@Entity('units')
export class UnitEntity implements IUnit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'int' })
  courseId!: number;

  @Column({ type: 'int', default: 1 })
  status!: number;

  @ManyToOne(() => CourseEntity, (course) => course.units)
  @JoinColumn({ name: 'courseId' })
  course: any;
}
