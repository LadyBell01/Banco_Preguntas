export class CategoryUseCase {
    port;
    constructor(port) {
        this.port = port;
    }
    async createCategory(category) {
        const existCategory = await this.port.getCategoryByName(category.name);
        if (existCategory) {
            throw new Error("Esta categoría ya existe");
        }
        return this.port.createCategory(category);
    }
    async getCategoryById(id) {
        return await this.port.getCategoryById(id);
    }
    async getCategoryByName(name) {
        return await this.port.getCategoryByName(name);
    }
    async getAllCategories() {
        return await this.port.getAllCategories();
    }
    async updateCategory(id, category) {
        const existingCategory = await this.port.getCategoryById(id);
        if (!existingCategory) {
            throw new Error("Categoría no encontrada");
        }
        if (category.name) {
            const nameTaken = await this.port.getCategoryByName(category.name);
            if (nameTaken && nameTaken.id_categories !== id) {
                throw new Error("El nombre de categoría ya está en uso");
            }
        }
        return this.port.updateCategory(id, category);
    }
    async deleteCategory(id) {
        const existingCategory = await this.port.getCategoryById(id);
        if (!existingCategory) {
            throw new Error("Categoría no encontrada");
        }
        return await this.port.deleteCategory(id);
    }
}
