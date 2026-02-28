import { Category } from "../entities/Category.js";

export interface CategoryPort {
  createCategory(category: Omit<Category, "id">): Promise<number>;
  updateCategory(id: number, category: Partial<Category>): Promise<boolean>;
  deleteCategory(id: number): Promise<boolean>;
  getCategoryById(id: number): Promise<Category | null>;
  getCategoryByName(name: string): Promise<Category | null>;
  getAllCategories(): Promise<Category[]>;
}
