import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User.js";
import envs from "../config/environment-vars.js";
dotenv.config();
export const AppDataSource = new DataSource({
    type: "mysql",
    port: Number(envs.DB_PORT),
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User],
});
//Método para la conexión a la base de datos
export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Conectado a la base de datos MySQL");
    }
    catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
};
