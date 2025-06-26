import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "ecommerce",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "MiPrimerEcommerce2025@"
});
console.log("USUARIO MYSQL:", process.env.DB_USER);