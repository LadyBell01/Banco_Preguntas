import { AppDataSource } from '../config/data-base.js';
import { CourseEntity } from '../entities/Course.js';
export class CourseAdapter {
    repository = AppDataSource.getRepository(CourseEntity);
    async create(course) {
        const newCourse = this.repository.create(course);
        return await this.repository.save(newCourse);
    }
    async findAll() {
        return await this.repository.find({ where: { status: 1 } });
    }
    async findById(id) {
        return await this.repository.findOne({ where: { id, status: 1 } });
    }
    async update(id, course) {
        await this.repository.update(id, course);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.update(id, { status: 0 }); // Baja lógica
        return (result.affected ?? 0) > 0;
    }
}
