export class UnitUseCase {
    unitPort;
    coursePort;
    constructor(unitPort, coursePort) {
        this.unitPort = unitPort;
        this.coursePort = coursePort;
    }
    async create(unit) {
        const courseExists = await this.coursePort.findById(unit.courseId);
        if (!courseExists || courseExists.status === 0) {
            throw new Error('Associated Course not found or inactive');
        }
        const unitToCreate = { ...unit, status: unit.status ?? 1 };
        return this.unitPort.create(unitToCreate);
    }
    async findAll() {
        return this.unitPort.findAll();
    }
    async findById(id) {
        return this.unitPort.findById(id);
    }
    async findByCourseId(courseId) {
        return this.unitPort.findByCourseId(courseId);
    }
    async update(id, unit) {
        if (unit.courseId) {
            const courseExists = await this.coursePort.findById(unit.courseId);
            if (!courseExists || courseExists.status === 0) {
                throw new Error('Associated Course not found or inactive');
            }
        }
        const existing = await this.unitPort.findById(id);
        if (!existing) {
            throw new Error('Unit not found');
        }
        return this.unitPort.update(id, unit);
    }
    async delete(id) {
        const existing = await this.unitPort.findById(id);
        if (!existing) {
            throw new Error('Unit not found');
        }
        return this.unitPort.delete(id);
    }
}
