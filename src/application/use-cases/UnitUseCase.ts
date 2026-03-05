import { Unit } from '../../domain/entities/Unit.js';
import { UnitPort } from '../../domain/ports/UnitPort.js';
import { CoursePort } from '../../domain/ports/CoursePort.js';

export class UnitUseCase {
  constructor(
    private readonly unitPort: UnitPort,
    private readonly coursePort: CoursePort
  ) { }

  async create(unit: Unit): Promise<Unit> {
    const courseExists = await this.coursePort.findById(unit.courseId);
    if (!courseExists || courseExists.status === 0) {
      throw new Error('Associated Course not found or inactive');
    }
    const unitToCreate = { ...unit, status: unit.status ?? 1 };
    return this.unitPort.create(unitToCreate);
  }

  async findAll(): Promise<Unit[]> {
    return this.unitPort.findAll();
  }

  async findById(id: number): Promise<Unit | null> {
    return this.unitPort.findById(id);
  }

  async findByCourseId(courseId: number): Promise<Unit[]> {
    return this.unitPort.findByCourseId(courseId);
  }

  async update(id: number, unit: Partial<Unit>): Promise<Unit | null> {
    if (unit.courseId) {
      const courseExists = await this.coursePort.findById(unit.courseId);
      if (!courseExists || courseExists.status === 0) {
        throw new Error('Associated Course not found or inactive');
      }
    }
    const existing = await this.unitPort.findById(id);
    if (!existing) {
      throw new Error('Unit not found');
    }
    return this.unitPort.update(id, unit);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.unitPort.findById(id);
    if (!existing) {
      throw new Error('Unit not found');
    }
    return this.unitPort.delete(id);
  }
}
