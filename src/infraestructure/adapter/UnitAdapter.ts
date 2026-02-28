import { Repository } from "typeorm";
import { Unit as UnitDomain } from "../../domain/entities/Unit.js";
import { Unit as UnitEntity } from "../entities/Unit.js";
import { UnitPort } from "../../domain/ports/UnitPort.js";
import { AppDataSource } from "../config/data-base.js";

export class UnitAdapter implements UnitPort {
  private unitRepository: Repository<UnitEntity>;

  constructor() {
    this.unitRepository = AppDataSource.getRepository(UnitEntity);
  }

  private toDomain(unit: UnitEntity): UnitDomain {
    return {
      id: unit.id_unit,
      name: unit.name_unit,
      description: unit.description_unit,
      courseId: unit.course_id,
      status: unit.status_unit,
    };
  }

  private toEntity(unit: Omit<UnitDomain, "id">): UnitEntity {
    const unitEntity = new UnitEntity();
    unitEntity.name_unit = unit.name;
    unitEntity.description_unit = unit.description;
    unitEntity.course_id = unit.courseId;
    unitEntity.status_unit = unit.status;
    return unitEntity;
  }

  async createUnit(unit: Omit<UnitDomain, "id">): Promise<number> {
    try {
      const newUnit = this.toEntity(unit);
      const savedUnit = await this.unitRepository.save(newUnit);
      return savedUnit.id_unit;
    } catch (error) {
      console.error("Error creando unidad:", error);
      throw new Error("Error al crear unidad");
    }
  }

  async updateUnit(id: number, unit: Partial<UnitDomain>): Promise<boolean> {
    try {
      const existingUnit = await this.unitRepository.findOne({
        where: { id_unit: id },
      });
      if (!existingUnit) return false;

      Object.assign(existingUnit, {
        name_unit: unit.name ?? existingUnit.name_unit,
        description_unit: unit.description ?? existingUnit.description_unit,
        course_id: unit.courseId ?? existingUnit.course_id,
        status_unit: unit.status ?? existingUnit.status_unit,
      });

      await this.unitRepository.save(existingUnit);
      return true;
    } catch (error) {
      console.error("Error actualizando unidad:", error);
      throw new Error("Error actualizando unidad");
    }
  }

  async deleteUnit(id: number): Promise<boolean> {
    try {
      const existingUnit = await this.unitRepository.findOne({
        where: { id_unit: id },
      });
      if (!existingUnit) return false;

      Object.assign(existingUnit, {
        status_unit: 0,
      });

      await this.unitRepository.save(existingUnit);
      return true;
    } catch (error) {
      console.error("Error al dar de baja la unidad:", error);
      throw new Error("Error al dar de baja unidad");
    }
  }

  async getUnitById(id: number): Promise<UnitDomain | null> {
    try {
      const unit = await this.unitRepository.findOne({
        where: { id_unit: id },
      });
      return unit ? this.toDomain(unit) : null;
    } catch (error) {
      console.error("Error obteniendo unidad por ID:", error);
      throw new Error("Error obteniendo unidad");
    }
  }

  async getUnitByName(name: string): Promise<UnitDomain | null> {
    const normalizedName = name.toLowerCase().trim();
    const unit = await this.unitRepository
      .createQueryBuilder("unit")
      .where("LOWER(unit.name_unit) = :name", { name: normalizedName })
      .getOne();

    if (!unit) return null;
    return this.toDomain(unit);
  }

  async getUnitsByCourseId(courseId: number): Promise<UnitDomain[]> {
    try {
      const units = await this.unitRepository.find({
        where: { course_id: courseId, status_unit: 1 },
      });
      return units.map((unit) => this.toDomain(unit));
    } catch (error) {
      console.error("Error obteniendo unidades por curso:", error);
      throw new Error("Error obteniendo unidades del curso");
    }
  }

  async getAllUnits(): Promise<UnitDomain[]> {
    try {
      const units = await this.unitRepository.find({
        where: { status_unit: 1 },
      });
      return units.map((unit) => this.toDomain(unit));
    } catch (error) {
      console.error("Error obteniendo unidades:", error);
      throw new Error("Error obteniendo lista de unidades");
    }
  }
}
