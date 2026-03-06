import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User.js";
import { CategoryEntity as Category } from "../entities/Category.js";
import { CourseEntity as Course } from "../entities/Course.js";
import { UnitEntity as Unit } from "../entities/Unit.js";
import { Question } from "../entities/Question.js";
import { Option } from "../entities/Option.js";
import { QuestionValidationEntity as QuestionValidation } from "../entities/QuestionValidation.js";
import envs from "../config/environment-vars.js";

dotenv.config();

console.log("Base de datos usada:", envs.DB_NAME);
export const AppDataSource = new DataSource({
  type: "postgres",
  host: envs.DB_HOST,
  port: Number(envs.DB_PORT),
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  schema: "public",
  synchronize: true,
  logging: false,
  ssl: true,
  entities: [User, Category, Course, Unit, Question, Option, QuestionValidation],
});

//Método para la conexión a la base de datos

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Conectado a la base de datos PostgresSQL");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
}