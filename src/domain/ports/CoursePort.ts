import { Course } from '../entities/Course.js';

export interface CoursePort {
  create(course: Course): Promise<Course>;
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  update(id: number, course: Partial<Course>): Promise<Course | null>;
  delete(id: number): Promise<boolean>;
}
