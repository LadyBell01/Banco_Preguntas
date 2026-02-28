import { CategoryUseCase } from "../../application/use-cases/CategoryUseCase.js";
import { Request, Response } from "express";
import { loadCategoryData, loadUpdateCategoryData } from "../Util/category-validation.js";
import { Category } from "../../domain/entities/Category.js";

export class CategoryController {
  private useCase: CategoryUseCase;

  constructor(useCase: CategoryUseCase) {
    this.useCase = useCase;
  }

  async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, status } = loadCategoryData(req.body);
      const category: Omit<Category, "id"> = { name, description, status };
      const categoryId = await this.useCase.createCategory(category);

      return res.status(201).json({
        message: "Categoría creada con éxito",
        categoryId,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al crear categoría",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const dataLoad = loadUpdateCategoryData(req.body);
      const updated = await this.useCase.updateCategory(id, dataLoad);

      return res.status(200).json({
        message: "Categoría actualizada",
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

  async getAllCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this.useCase.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener categorías" });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const category = await this.useCase.getCategoryById(id);

      if (!category) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ error: "Error al buscar categoría" });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await this.useCase.deleteCategory(id);

      return res.status(200).json({ message: "Categoría eliminada con éxito" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error al eliminar categoría",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error al eliminar categoría" });
    }
  }
}
