import { Repository } from "typeorm";
import { Category as CategoryDomain } from "../../domain/entities/Category.js";
import { Category as CategoryEntity } from "../entities/Category.js";
import { CategoryPort } from "../../domain/ports/CategoryPort.js";
import { AppDataSource } from "../config/data-base.js";

export class CategoryAdapter implements CategoryPort {
  private categoryRepository: Repository<CategoryEntity>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(CategoryEntity);
  }

  private toDomain(category: CategoryEntity): CategoryDomain {
    return {
      id: category.id_category,
      name: category.name_category,
      description: category.description_category,
      status: category.status_category,
    };
  }

  private toEntity(category: Omit<CategoryDomain, "id">): CategoryEntity {
    const categoryEntity = new CategoryEntity();
    categoryEntity.name_category = category.name;
    categoryEntity.description_category = category.description;
    categoryEntity.status_category = category.status;
    return categoryEntity;
  }

  async createCategory(category: Omit<CategoryDomain, "id">): Promise<number> {
    try {
      const newCategory = this.toEntity(category);
      const savedCategory = await this.categoryRepository.save(newCategory);
      return savedCategory.id_category;
    } catch (error) {
      console.error("Error creando categoría:", error);
      throw new Error("Error al crear categoría");
    }
  }

  async updateCategory(id: number, category: Partial<CategoryDomain>): Promise<boolean> {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { id_category: id },
      });
      if (!existingCategory) return false;

      Object.assign(existingCategory, {
        name_category: category.name ?? existingCategory.name_category,
        description_category: category.description ?? existingCategory.description_category,
        status_category: category.status ?? existingCategory.status_category,
      });

      await this.categoryRepository.save(existingCategory);
      return true;
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      throw new Error("Error actualizando categoría");
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { id_category: id },
      });
      if (!existingCategory) return false;

      Object.assign(existingCategory, {
        status_category: 0,
      });

      await this.categoryRepository.save(existingCategory);
      return true;
    } catch (error) {
      console.error("Error al dar de baja la categoría:", error);
      throw new Error("Error al dar de baja categoría");
    }
  }

  async getCategoryById(id: number): Promise<CategoryDomain | null> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id_category: id },
      });
      return category ? this.toDomain(category) : null;
    } catch (error) {
      console.error("Error obteniendo categoría por ID:", error);
      throw new Error("Error obteniendo categoría");
    }
  }

  async getCategoryByName(name: string): Promise<CategoryDomain | null> {
    const normalizedName = name.toLowerCase().trim();
    const category = await this.categoryRepository
      .createQueryBuilder("category")
      .where("LOWER(category.name_category) = :name", { name: normalizedName })
      .getOne();

    if (!category) return null;
    return this.toDomain(category);
  }

  async getAllCategories(): Promise<CategoryDomain[]> {
    try {
      const categories = await this.categoryRepository.find({
        where: { status_category: 1 },
      });
      return categories.map((cat) => this.toDomain(cat));
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
      throw new Error("Error obteniendo lista de categorías");
    }
  }
}
