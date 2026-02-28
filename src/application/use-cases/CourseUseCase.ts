import { Course } from "../../domain/entities/Course.js";
import { CoursePort } from "../../domain/ports/CoursePort.js";

export class CourseUseCase {
  private port: CoursePort;

  constructor(port: CoursePort) {
    this.port = port;
  }

  async createCourse(course: Omit<Course, "id">): Promise<number> {
    const existCourse = await this.port.getCourseByName(course.name);
    if (existCourse) {
      throw new Error("Este curso ya existe");
    }
    return this.port.createCourse(course);
  }

  async getCourseById(id: number): Promise<Course | null> {
    return await this.port.getCourseById(id);
  }

  async getCourseByName(name: string): Promise<Course | null> {
    return await this.port.getCourseByName(name);
  }

  async getAllCourses(): Promise<Course[]> {
    return await this.port.getAllCourses();
  }

  async updateCourse(id: number, course: Partial<Course>): Promise<boolean> {
    const existingCourse = await this.port.getCourseById(id);
    if (!existingCourse) {
      throw new Error("Curso no encontrado");
    }

    if (course.name) {
      const nameTaken = await this.port.getCourseByName(course.name);
      if (nameTaken && nameTaken.id !== id) {
        throw new Error("El nombre del curso ya está en uso");
      }
    }

    return this.port.updateCourse(id, course);
  }

  async deleteCourse(id: number): Promise<boolean> {
    const existingCourse = await this.port.getCourseById(id);
    if (!existingCourse) {
      throw new Error("Curso no encontrado");
    }
    return await this.port.deleteCourse(id);
  }
}
