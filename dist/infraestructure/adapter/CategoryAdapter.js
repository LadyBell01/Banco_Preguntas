import { AppDataSource } from '../config/data-base.js';
import { CategoryEntity } from '../entities/Category.js';
export class CategoryAdapter {
    repository = AppDataSource.getRepository(CategoryEntity);
    async create(category) {
        const newCategory = this.repository.create(category);
        return await this.repository.save(newCategory);
    }
    async findAll() {
        return await this.repository.find({ where: { status: 1 } });
    }
    async findById(id) {
        return await this.repository.findOne({ where: { id, status: 1 } });
    }
    async update(id, category) {
        await this.repository.update(id, category);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.update(id, { status: 0 }); // Baja lógica
        return (result.affected ?? 0) > 0;
    }
}
