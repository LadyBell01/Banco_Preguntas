export class CourseUseCase {
    port;
    constructor(port) {
        this.port = port;
    }
    async createCourse(course) {
        const existCourse = await this.port.getCourseByName(course.name);
        if (existCourse) {
            throw new Error("Este curso ya existe");
        }
        return this.port.createCourse(course);
    }
    async getCourseById(id) {
        return await this.port.getCourseById(id);
    }
    async getCourseByName(name) {
        return await this.port.getCourseByName(name);
    }
    async getAllCourses() {
        return await this.port.getAllCourses();
    }
    async updateCourse(id, course) {
        const existingCourse = await this.port.getCourseById(id);
        if (!existingCourse) {
            throw new Error("Curso no encontrado");
        }
        if (course.name) {
            const nameTaken = await this.port.getCourseByName(course.name);
            if (nameTaken && nameTaken.id_courses !== id) {
                throw new Error("El nombre del curso ya está en uso");
            }
        }
        return this.port.updateCourse(id, course);
    }
    async deleteCourse(id) {
        const existingCourse = await this.port.getCourseById(id);
        if (!existingCourse) {
            throw new Error("Curso no encontrado");
        }
        return await this.port.deleteCourse(id);
    }
}
