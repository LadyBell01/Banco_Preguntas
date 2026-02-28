import { UnitUseCase } from "../../application/use-cases/UnitUseCase.js";
import { Request, Response } from "express";
import { loadUnitData, loadUpdateUnitData } from "../Util/unit-validation.js";
import { Unit } from "../../domain/entities/Unit.js";

export class UnitController {
  private useCase: UnitUseCase;

  constructor(useCase: UnitUseCase) {
    this.useCase = useCase;
  }

  async createUnit(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, courseId, status } = loadUnitData(req.body);
      const unit: Omit<Unit, "id"> = { name, description, courseId, status };
      const unitId = await this.useCase.createUnit(unit);

      return res.status(201).json({
        message: "Unidad creada con éxito",
        unitId,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al crear unidad",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateUnit(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const dataLoad = loadUpdateUnitData(req.body);
      const updated = await this.useCase.updateUnit(id, dataLoad);

      return res.status(200).json({
        message: "Unidad actualizada",
        updated,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al actualizar",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al actualizar" });
    }
  }

  async getAllUnits(req: Request, res: Response): Promise<Response> {
    try {
      const units = await this.useCase.getAllUnits();
      return res.status(200).json(units);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener unidades" });
    }
  }

  async getUnitById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const unit = await this.useCase.getUnitById(id);

      if (!unit) {
        return res.status(404).json({ message: "Unidad no encontrada" });
      }

      return res.status(200).json(unit);
    } catch (error) {
      return res.status(500).json({ error: "Error al buscar unidad" });
    }
  }

  async getUnitsByCourse(req: Request, res: Response): Promise<Response> {
    try {
      const courseId = Number(req.params.courseId);
      if (Number.isNaN(courseId)) {
        return res.status(400).json({ error: "ID de curso inválido" });
      }

      const units = await this.useCase.getUnitsByCourseId(courseId);
      return res.status(200).json(units);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al obtener unidades",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al obtener unidades del curso" });
    }
  }

  async deleteUnit(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await this.useCase.deleteUnit(id);

      return res.status(200).json({ message: "Unidad eliminada con éxito" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al eliminar unidad",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al eliminar unidad" });
    }
  }
}
