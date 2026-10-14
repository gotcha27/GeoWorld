
 // Configure la connexion entre TypeORM et la base MySQL de GeoWorld.
import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ["./src/entity/*.ts"],
    migrations: ["./src/migrations/*.ts"],
    subscribers: [],
});
