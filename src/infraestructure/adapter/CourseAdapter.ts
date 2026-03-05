import { AppDataSource } from '../config/data-base.js';
import { Course } from '../../domain/entities/Course.js';
import { CoursePort } from '../../domain/ports/CoursePort.js';
import { CourseEntity } from '../entities/Course.js';

export class CourseAdapter implements CoursePort {
  private repository = AppDataSource.getRepository(CourseEntity);

  async create(course: Course): Promise<Course> {
    const newCourse = this.repository.create(course);
    return await this.repository.save(newCourse);
  }

  async findAll(): Promise<Course[]> {
    return await this.repository.find({ where: { status: 1 } });
  }

  async findById(id: number): Promise<Course | null> {
    return await this.repository.findOne({ where: { id, status: 1 } });
  }

  async update(id: number, course: Partial<Course>): Promise<Course | null> {
    await this.repository.update(id, course);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { status: 0 }); // Baja lógica
    return (result.affected ?? 0) > 0;
  }
}
