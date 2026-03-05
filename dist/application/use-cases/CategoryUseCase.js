import { NotFoundError } from '../../infraestructure/web/errorMiddleware.js';
export class CategoryUseCase {
    categoryPort;
    constructor(categoryPort) {
        this.categoryPort = categoryPort;
    }
    async create(category) {
        const categoryToCreate = { ...category, status: category.status ?? 1 };
        return this.categoryPort.create(categoryToCreate);
    }
    async findAll() {
        return this.categoryPort.findAll();
    }
    async findById(id) {
        const category = await this.categoryPort.findById(id);
        if (!category) {
            throw new NotFoundError('Categoría no encontrada');
        }
        return category;
    }
    async update(id, category) {
        const existing = await this.categoryPort.findById(id);
        if (!existing) {
            throw new NotFoundError('Categoría no encontrada');
        }
        return this.categoryPort.update(id, category);
    }
    async delete(id) {
        const existing = await this.categoryPort.findById(id);
        if (!existing) {
            throw new NotFoundError('Categoría no encontrada');
        }
        return this.categoryPort.delete(id);
    }
}
