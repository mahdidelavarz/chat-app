import "reflect-metadata";
import { DataSource } from "typeorm";

import dotenv from "dotenv";
import { User } from "../models/User";
import { Message } from "../models/Messages";
import { Conversation } from "../models/Conversation";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "1433"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // Auto-create tables (dev only)
    logging: false,
    entities: [User, Message, Conversation],
    migrations: [],
    subscribers: [],
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
});