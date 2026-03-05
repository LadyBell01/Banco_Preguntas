import { AppDataSource } from '../config/data-base.js';
import { Unit } from '../../domain/entities/Unit.js';
import { UnitPort } from '../../domain/ports/UnitPort.js';
import { UnitEntity } from '../entities/Unit.js';

export class UnitAdapter implements UnitPort {
  private repository = AppDataSource.getRepository(UnitEntity);

  async create(unit: Unit): Promise<Unit> {
    const newUnit = this.repository.create(unit);
    return await this.repository.save(newUnit);
  }

  async findAll(): Promise<Unit[]> {
    return await this.repository.find({ where: { status: 1 }, relations: ['course'] });
  }

  async findById(id: number): Promise<Unit | null> {
    return await this.repository.findOne({ where: { id, status: 1 }, relations: ['course'] });
  }

  async findByCourseId(courseId: number): Promise<Unit[]> {
    return await this.repository.find({ where: { courseId, status: 1 } });
  }

  async update(id: number, unit: Partial<Unit>): Promise<Unit | null> {
    await this.repository.update(id, unit);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { status: 0 }); // Baja lógica
    return (result.affected ?? 0) > 0;
  }
}
