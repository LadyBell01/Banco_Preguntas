import { Category } from '../entities/Category.js';

export interface CategoryPort {
  create(category: Category): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  update(id: number, category: Partial<Category>): Promise<Category | null>;
  delete(id: number): Promise<boolean>;
}
