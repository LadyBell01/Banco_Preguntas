import { Course } from "../entities/Course.js";

export interface CoursePort {
  createCourse(course: Omit<Course, "id">): Promise<number>;
  updateCourse(id: number, course: Partial<Course>): Promise<boolean>;
  deleteCourse(id: number): Promise<boolean>;
  getCourseById(id: number): Promise<Course | null>;
  getCourseByName(name: string): Promise<Course | null>;
  getAllCourses(): Promise<Course[]>;
}
