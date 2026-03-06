export class UnitUseCase {
    port;
    coursePort;
    constructor(port, coursePort) {
        this.port = port;
        this.coursePort = coursePort;
    }
    async createUnit(unit) {
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
    async getUnitById(id) {
        return await this.port.getUnitById(id);
    }
    async getUnitByName(name) {
        return await this.port.getUnitByName(name);
    }
    async getUnitsByCourseId(courseId) {
        const existCourse = await this.coursePort.getCourseById(courseId);
        if (!existCourse) {
            throw new Error("El curso especificado no existe");
        }
        return await this.port.getUnitsByCourseId(courseId);
    }
    async getAllUnits() {
        return await this.port.getAllUnits();
    }
    async updateUnit(id, unit) {
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
            if (nameTaken && nameTaken.id_units !== id && nameTaken.courseId === targetCourseId) {
                throw new Error("El nombre de la unidad ya está en uso en este curso");
            }
        }
        return this.port.updateUnit(id, unit);
    }
    async deleteUnit(id) {
        const existingUnit = await this.port.getUnitById(id);
        if (!existingUnit) {
            throw new Error("Unidad no encontrada");
        }
        return await this.port.deleteUnit(id);
    }
}
