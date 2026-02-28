import { Unit } from "../entities/Unit.js";

export interface UnitPort {
  createUnit(unit: Omit<Unit, "id">): Promise<number>;
  updateUnit(id: number, unit: Partial<Unit>): Promise<boolean>;
  deleteUnit(id: number): Promise<boolean>;
  getUnitById(id: number): Promise<Unit | null>;
  getUnitByName(name: string): Promise<Unit | null>;
  getUnitsByCourseId(courseId: number): Promise<Unit[]>;
  getAllUnits(): Promise<Unit[]>;
}
