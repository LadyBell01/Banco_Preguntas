import { Unit } from '../entities/Unit.js';

export interface UnitPort {
  create(unit: Unit): Promise<Unit>;
  findAll(): Promise<Unit[]>;
  findById(id: number): Promise<Unit | null>;
  findByCourseId(courseId: number): Promise<Unit[]>;
  update(id: number, unit: Partial<Unit>): Promise<Unit | null>;
  delete(id: number): Promise<boolean>;
}
