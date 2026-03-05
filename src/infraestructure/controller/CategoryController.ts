import { Request, Response, NextFunction } from 'express';
import { CategoryUseCase } from '../../application/use-cases/CategoryUseCase.js';
import { categorySchema, updateCategorySchema } from '../Util/category-validation.js';
import { ValidationError } from '../web/errorMiddleware.js';

export class CategoryController {
  constructor(private readonly categoryUseCase: CategoryUseCase) { }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = categorySchema.validate(req.body);
      if (error) {
        throw new ValidationError('Validation Error', error.details.map(d => d.message));
      }

      const category = await this.categoryUseCase.create(value);
      return res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryUseCase.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const category = await this.categoryUseCase.findById(id);
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { error, value } = updateCategorySchema.validate(req.body);
      if (error) {
        throw new ValidationError('Validation Error', error.details.map(d => d.message));
      }

      const updated = await this.categoryUseCase.update(id, value);
      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await this.categoryUseCase.delete(id);
      return res.status(200).json({ message: 'Category deleted successfully (baja lógica)' });
    } catch (error) {
      next(error);
    }
  }
}
