import { Unit } from "../../domain/entities/Unit.js";
import { UnitPort } from "../../domain/ports/UnitPort.js";
import { CoursePort } from "../../domain/ports/CoursePort.js";

export class UnitUseCase {
  private port: UnitPort;
  private coursePort: CoursePort;

  constructor(port: UnitPort, coursePort: CoursePort) {
    this.port = port;
    this.coursePort = coursePort;
  }

  async createUnit(unit: Omit<Unit, "id">): Promise<number> {
    const existCourse = await this.coursePort.getCourseById(unit.courseId);
    if (!existCourse) {
      throw new Error("El curso especificado no existe");
    }

    const existUnit = await this.port.getUnitByName(unit.name);
    if (existUnit && existUnit.courseId === unit.courseId) {
      throw new Error("Esta unidad ya existe en el curso");
    }
    return this.port.createUnit(unit);
  }

  async getUnitById(id: number): Promise<Unit | null> {
    return await this.port.getUnitById(id);
  }

  async getUnitByName(name: string): Promise<Unit | null> {
    return await this.port.getUnitByName(name);
  }

  async getUnitsByCourseId(courseId: number): Promise<Unit[]> {
    const existCourse = await this.coursePort.getCourseById(courseId);
    if (!existCourse) {
      throw new Error("El curso especificado no existe");
    }
    return await this.port.getUnitsByCourseId(courseId);
  }

  async getAllUnits(): Promise<Unit[]> {
    return await this.port.getAllUnits();
  }

  async updateUnit(id: number, unit: Partial<Unit>): Promise<boolean> {
    const existingUnit = await this.port.getUnitById(id);
    if (!existingUnit) {
      throw new Error("Unidad no encontrada");
    }

    if (unit.courseId) {
      const existCourse = await this.coursePort.getCourseById(unit.courseId);
      if (!existCourse) {
        throw new Error("El curso especificado no existe");
      }
    }

    if (unit.name) {
      const nameTaken = await this.port.getUnitByName(unit.name);
      const targetCourseId = unit.courseId ?? existingUnit.courseId;
      if (nameTaken && nameTaken.id !== id && nameTaken.courseId === targetCourseId) {
        throw new Error("El nombre de la unidad ya está en uso en este curso");
      }
    }

    return this.port.updateUnit(id, unit);
  }

  async deleteUnit(id: number): Promise<boolean> {
    const existingUnit = await this.port.getUnitById(id);
    if (!existingUnit) {
      throw new Error("Unidad no encontrada");
    }
    return await this.port.deleteUnit(id);
  }
}
