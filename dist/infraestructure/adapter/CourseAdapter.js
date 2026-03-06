import { Course as CourseEntity } from "../entities/Course.js";
import { AppDataSource } from "../config/data-base.js";
export class CourseAdapter {
    courseRepository;
    constructor() {
        this.courseRepository = AppDataSource.getRepository(CourseEntity);
    }
    toDomain(course) {
        return {
            id_courses: course.id_courses,
            name: course.name_course,
            description: course.description_course,
            status: course.status_course,
        };
    }
    toEntity(course) {
        const courseEntity = new CourseEntity();
        courseEntity.name_course = course.name;
        courseEntity.description_course = course.description;
        courseEntity.status_course = course.status;
        return courseEntity;
    }
    async createCourse(course) {
        try {
            const newCourse = this.toEntity(course);
            const savedCourse = await this.courseRepository.save(newCourse);
            return savedCourse.id_courses;
        }
        catch (error) {
            console.error("Error creando curso:", error);
            throw new Error("Error al crear curso");
        }
    }
    async updateCourse(id, course) {
        try {
            const existingCourse = await this.courseRepository.findOne({
                where: { id_courses: id },
            });
            if (!existingCourse)
                return false;
            Object.assign(existingCourse, {
                name_course: course.name ?? existingCourse.name_course,
                description_course: course.description ?? existingCourse.description_course,
                status_course: course.status ?? existingCourse.status_course,
            });
            await this.courseRepository.save(existingCourse);
            return true;
        }
        catch (error) {
            console.error("Error actualizando curso:", error);
            throw new Error("Error actualizando curso");
        }
    }
    async deleteCourse(id) {
        try {
            const existingCourse = await this.courseRepository.findOne({
                where: { id_courses: id },
            });
            if (!existingCourse)
                return false;
            Object.assign(existingCourse, {
                status_course: 0,
            });
            await this.courseRepository.save(existingCourse);
            return true;
        }
        catch (error) {
            console.error("Error al dar de baja el curso:", error);
            throw new Error("Error al dar de baja curso");
        }
    }
    async getCourseById(id) {
        try {
            const course = await this.courseRepository.findOne({
                where: { id_courses: id },
            });
            return course ? this.toDomain(course) : null;
        }
        catch (error) {
            console.error("Error obteniendo curso por ID:", error);
            throw new Error("Error obteniendo curso");
        }
    }
    async getCourseByName(name) {
        const normalizedName = name.toLowerCase().trim();
        const course = await this.courseRepository
            .createQueryBuilder("course")
            .where("LOWER(course.name_course) = :name", { name: normalizedName })
            .getOne();
        if (!course)
            return null;
        return this.toDomain(course);
    }
    async getAllCourses() {
        try {
            const courses = await this.courseRepository.find({
                where: { status_course: 1 },
            });
            return courses.map((course) => this.toDomain(course));
        }
        catch (error) {
            console.error("Error obteniendo cursos:", error);
            throw new Error("Error obteniendo lista de cursos");
        }
    }
}
