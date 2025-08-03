import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// pool de conexiones para optimizar rendimiento de base de datos
// reutiliza conexiones existentes en lugar de crear/cerrar constantemente
export const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "ecommerce",
  user: process.env.DB_USER || "ecommerce_user",
  // fallback para desarrollo local - en produccion siempre usar variables de entorno
  password: process.env.DB_PASSWORD || "MiPrimerEcommerce2025@"
});