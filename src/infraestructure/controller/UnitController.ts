import { Request, Response } from 'express';
import { UnitUseCase } from '../../application/use-cases/UnitUseCase.js';
import { unitSchema, updateUnitSchema } from '../Util/unit-validation.js';

export class UnitController {
  constructor(private readonly unitUseCase: UnitUseCase) { }

  async createUnit(req: Request, res: Response) {
    try {
      const { error, value } = unitSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: 'Validation Error', details: error.details[0].message });
      }

      const unit = await this.unitUseCase.create(value);
      return res.status(201).json(unit);
    } catch (error: any) {
      if (error.message === 'Associated Course not found or inactive') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async getUnits(req: Request, res: Response) {
    try {
      const units = await this.unitUseCase.findAll();
      return res.status(200).json(units);
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUnitById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const unit = await this.unitUseCase.findById(id);

      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      return res.status(200).json(unit);
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUnitsByCourse(req: Request, res: Response) {
    try {
      const courseId = parseInt(req.params.courseId as string, 10);
      const units = await this.unitUseCase.findByCourseId(courseId);
      return res.status(200).json(units);
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateUnit(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { error, value } = updateUnitSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: 'Validation Error', details: error.details[0].message });
      }

      const updated = await this.unitUseCase.update(id, value);
      return res.status(200).json(updated);
    } catch (error: any) {
      if (['Associated Course not found or inactive', 'Unit not found'].includes(error.message)) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteUnit(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await this.unitUseCase.delete(id);
      return res.status(200).json({ message: 'Unit deleted successfully (baja lógica)' });
    } catch (error: any) {
      if (error.message === 'Unit not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
