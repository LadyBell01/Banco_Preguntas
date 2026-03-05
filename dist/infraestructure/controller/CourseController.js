import { courseSchema, updateCourseSchema } from '../Util/course-validation.js';
export class CourseController {
    courseUseCase;
    constructor(courseUseCase) {
        this.courseUseCase = courseUseCase;
    }
    async createCourse(req, res) {
        try {
            const { error, value } = courseSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: 'Validation Error', details: error.details[0].message });
            }
            const course = await this.courseUseCase.create(value);
            return res.status(201).json(course);
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    async getCourses(req, res) {
        try {
            const courses = await this.courseUseCase.findAll();
            return res.status(200).json(courses);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getCourseById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const course = await this.courseUseCase.findById(id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            return res.status(200).json(course);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async updateCourse(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { error, value } = updateCourseSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: 'Validation Error', details: error.details[0].message });
            }
            const updated = await this.courseUseCase.update(id, value);
            return res.status(200).json(updated);
        }
        catch (error) {
            if (error.message === 'Course not found') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async deleteCourse(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            await this.courseUseCase.delete(id);
            return res.status(200).json({ message: 'Course deleted successfully (baja lógica)' });
        }
        catch (error) {
            if (error.message === 'Course not found') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
