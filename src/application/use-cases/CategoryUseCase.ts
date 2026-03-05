import { Category } from '../../domain/entities/Category.js';
import { CategoryPort } from '../../domain/ports/CategoryPort.js';
import { NotFoundError } from '../../infraestructure/web/errorMiddleware.js';

export class CategoryUseCase {
  constructor(private readonly categoryPort: CategoryPort) { }

  async create(category: Category): Promise<Category> {
    const categoryToCreate = { ...category, status: category.status ?? 1 };
    return this.categoryPort.create(categoryToCreate);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryPort.findAll();
  }

  async findById(id: number): Promise<Category | null> {
    const category = await this.categoryPort.findById(id);
    if (!category) {
      throw new NotFoundError('Categoría no encontrada');
    }
    return category;
  }

  async update(id: number, category: Partial<Category>): Promise<Category | null> {
    const existing = await this.categoryPort.findById(id);
    if (!existing) {
      throw new NotFoundError('Categoría no encontrada');
    }
    return this.categoryPort.update(id, category);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.categoryPort.findById(id);
    if (!existing) {
      throw new NotFoundError('Categoría no encontrada');
    }
    return this.categoryPort.delete(id);
  }
}
