import { AppDataSource } from '../config/data-base.js';
import { Category } from '../../domain/entities/Category.js';
import { CategoryPort } from '../../domain/ports/CategoryPort.js';
import { CategoryEntity } from '../entities/Category.js';

export class CategoryAdapter implements CategoryPort {
  private repository = AppDataSource.getRepository(CategoryEntity);

  async create(category: Category): Promise<Category> {
    const newCategory = this.repository.create(category);
    return await this.repository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return await this.repository.find({ where: { status: 1 } });
  }

  async findById(id: number): Promise<Category | null> {
    return await this.repository.findOne({ where: { id, status: 1 } });
  }

  async update(id: number, category: Partial<Category>): Promise<Category | null> {
    await this.repository.update(id, category);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { status: 0 }); // Baja lógica
    return (result.affected ?? 0) > 0;
  }
}
