export class CourseUseCase {
    coursePort;
    constructor(coursePort) {
        this.coursePort = coursePort;
    }
    async create(course) {
        const courseToCreate = { ...course, status: course.status ?? 1 };
        return this.coursePort.create(courseToCreate);
    }
    async findAll() {
        return this.coursePort.findAll();
    }
    async findById(id) {
        return this.coursePort.findById(id);
    }
    async update(id, course) {
        const existing = await this.coursePort.findById(id);
        if (!existing) {
            throw new Error('Course not found');
        }
        return this.coursePort.update(id, course);
    }
    async delete(id) {
        const existing = await this.coursePort.findById(id);
        if (!existing) {
            throw new Error('Course not found');
        }
        return this.coursePort.delete(id);
    }
}
