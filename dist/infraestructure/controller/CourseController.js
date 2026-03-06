import { loadCourseData, loadUpdateCourseData } from "../Util/course-validation.js";
export class CourseController {
    useCase;
    constructor(useCase) {
        this.useCase = useCase;
    }
    async createCourse(req, res) {
        try {
            const { name, description, status } = loadCourseData(req.body);
            const course = { name, description, status };
            const courseId = await this.useCase.createCourse(course);
            return res.status(201).json({
                message: "Curso creado con éxito",
                courseId,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al crear curso",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async updateCourse(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const dataLoad = loadUpdateCourseData(req.body);
            const updated = await this.useCase.updateCourse(id, dataLoad);
            return res.status(200).json({
                message: "Curso actualizado",
                updated,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al actualizar",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al actualizar" });
        }
    }
    async getAllCourses(req, res) {
        try {
            const courses = await this.useCase.getAllCourses();
            return res.status(200).json(courses);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener cursos" });
        }
    }
    async getCourseById(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const course = await this.useCase.getCourseById(id);
            if (!course) {
                return res.status(404).json({ message: "Curso no encontrado" });
            }
            return res.status(200).json(course);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al buscar curso" });
        }
    }
    async deleteCourse(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            await this.useCase.deleteCourse(id);
            return res.status(200).json({ message: "Curso eliminado con éxito" });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: "Error al eliminar curso",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error al eliminar curso" });
        }
    }
}
