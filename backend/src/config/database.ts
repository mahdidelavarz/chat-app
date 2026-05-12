import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Message } from "../models/Messages";
import { Conversation } from "../models/Conversation";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "node_user",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_DATABASE || "chatDb",
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",
  entities: [User, Message, Conversation],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  // Connection pool settings
  extra: {
    max: 20,
    connectionTimeoutMillis: 10000, // 10 seconds
    idleTimeoutMillis: 30000,
  },
  // Retry settings
  connectTimeoutMS: 10000,
});
