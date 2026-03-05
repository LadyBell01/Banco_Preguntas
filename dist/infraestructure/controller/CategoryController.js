import { categorySchema, updateCategorySchema } from '../Util/category-validation.js';
import { ValidationError } from '../web/errorMiddleware.js';
export class CategoryController {
    categoryUseCase;
    constructor(categoryUseCase) {
        this.categoryUseCase = categoryUseCase;
    }
    async createCategory(req, res, next) {
        try {
            const { error, value } = categorySchema.validate(req.body);
            if (error) {
                throw new ValidationError('Validation Error', error.details.map(d => d.message));
            }
            const category = await this.categoryUseCase.create(value);
            return res.status(201).json(category);
        }
        catch (error) {
            next(error);
        }
    }
    async getCategories(req, res, next) {
        try {
            const categories = await this.categoryUseCase.findAll();
            return res.status(200).json(categories);
        }
        catch (error) {
            next(error);
        }
    }
    async getCategoryById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const category = await this.categoryUseCase.findById(id);
            return res.status(200).json(category);
        }
        catch (error) {
            next(error);
        }
    }
    async updateCategory(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const { error, value } = updateCategorySchema.validate(req.body);
            if (error) {
                throw new ValidationError('Validation Error', error.details.map(d => d.message));
            }
            const updated = await this.categoryUseCase.update(id, value);
            return res.status(200).json(updated);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteCategory(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            await this.categoryUseCase.delete(id);
            return res.status(200).json({ message: 'Category deleted successfully (baja lógica)' });
        }
        catch (error) {
            next(error);
        }
    }
}
