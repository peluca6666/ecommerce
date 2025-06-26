import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

console.log('Intentando conectar con:');
console.log('user:', process.env.DB_USER);
console.log('password:', process.env.DB_PASSWORD);
console.log('database:', process.env.DB_NAME);

export const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "ecommerce",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "MiPrimerEcommerce2025@"
});
