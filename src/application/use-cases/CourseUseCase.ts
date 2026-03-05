import { Course } from '../../domain/entities/Course.js';
import { CoursePort } from '../../domain/ports/CoursePort.js';

export class CourseUseCase {
  constructor(private readonly coursePort: CoursePort) { }

  async create(course: Course): Promise<Course> {
    const courseToCreate = { ...course, status: course.status ?? 1 };
    return this.coursePort.create(courseToCreate);
  }

  async findAll(): Promise<Course[]> {
    return this.coursePort.findAll();
  }

  async findById(id: number): Promise<Course | null> {
    return this.coursePort.findById(id);
  }

  async update(id: number, course: Partial<Course>): Promise<Course | null> {
    const existing = await this.coursePort.findById(id);
    if (!existing) {
      throw new Error('Course not found');
    }
    return this.coursePort.update(id, course);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.coursePort.findById(id);
    if (!existing) {
      throw new Error('Course not found');
    }
    return this.coursePort.delete(id);
  }
}
