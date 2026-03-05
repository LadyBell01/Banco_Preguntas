import { AppDataSource } from '../config/data-base.js';
import { UnitEntity } from '../entities/Unit.js';
export class UnitAdapter {
    repository = AppDataSource.getRepository(UnitEntity);
    async create(unit) {
        const newUnit = this.repository.create(unit);
        return await this.repository.save(newUnit);
    }
    async findAll() {
        return await this.repository.find({ where: { status: 1 }, relations: ['course'] });
    }
    async findById(id) {
        return await this.repository.findOne({ where: { id, status: 1 }, relations: ['course'] });
    }
    async findByCourseId(courseId) {
        return await this.repository.find({ where: { courseId, status: 1 } });
    }
    async update(id, unit) {
        await this.repository.update(id, unit);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.update(id, { status: 0 }); // Baja lógica
        return (result.affected ?? 0) > 0;
    }
}
