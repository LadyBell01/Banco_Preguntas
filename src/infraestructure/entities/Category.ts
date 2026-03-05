import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Category as ICategory } from '../../domain/entities/Category.js';

@Entity('categories')
export class CategoryEntity implements ICategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'int', default: 1 })
  status!: number;
}
