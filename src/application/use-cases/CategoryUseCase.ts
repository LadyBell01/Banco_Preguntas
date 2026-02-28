import { Category } from "../../domain/entities/Category.js";
import { CategoryPort } from "../../domain/ports/CategoryPort.js";

export class CategoryUseCase {
  private port: CategoryPort;

  constructor(port: CategoryPort) {
    this.port = port;
  }

  async createCategory(category: Omit<Category, "id">): Promise<number> {
    const existCategory = await this.port.getCategoryByName(category.name);
    if (existCategory) {
      throw new Error("Esta categoría ya existe");
    }
    return this.port.createCategory(category);
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return await this.port.getCategoryById(id);
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    return await this.port.getCategoryByName(name);
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.port.getAllCategories();
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<boolean> {
    const existingCategory = await this.port.getCategoryById(id);
    if (!existingCategory) {
      throw new Error("Categoría no encontrada");
    }

    if (category.name) {
      const nameTaken = await this.port.getCategoryByName(category.name);
      if (nameTaken && nameTaken.id !== id) {
        throw new Error("El nombre de categoría ya está en uso");
      }
    }

    return this.port.updateCategory(id, category);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const existingCategory = await this.port.getCategoryById(id);
    if (!existingCategory) {
      throw new Error("Categoría no encontrada");
    }
    return await this.port.deleteCategory(id);
  }
}
