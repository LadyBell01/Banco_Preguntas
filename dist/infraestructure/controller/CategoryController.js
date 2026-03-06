import { loadCategoryData, loadUpdateCategoryData } from "../Util/category-validation.js";
export class CategoryController {
    useCase;
    constructor(useCase) {
        this.useCase = useCase;
    }
    async createCategory(req, res) {
        try {
            const { name, description, status } = loadCategoryData(req.body);
            const category = { name, description, status };
            const categoryId = await this.useCase.createCategory(category);
            return res.status(201).json({
                message: "Categoría creada con éxito",
                categoryId,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al crear categoría",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async updateCategory(req, res) {
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
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al actualizar",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al actualizar" });
        }
    }
    async getAllCategories(req, res) {
        try {
            const categories = await this.useCase.getAllCategories();
            return res.status(200).json(categories);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener categorías" });
        }
    }
    async getCategoryById(req, res) {
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
        }
        catch (error) {
            return res.status(500).json({ error: "Error al buscar categoría" });
        }
    }
    async deleteCategory(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            await this.useCase.deleteCategory(id);
            return res.status(200).json({ message: "Categoría eliminada con éxito" });
        }
        catch (error) {
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
