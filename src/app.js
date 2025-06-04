import {pool} from '../backend/database/connectionMySQL.js';
import bcrypt from 'bcrypt';


(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conexión establecida con MySQL");
    conn.release();
    process.exit(0); // Cierra el proceso si es solo prueba
  } catch (err) {
    console.error("❌ No se pudo conectar a la base de datos:", err);
    process.exit(1); // Salida con error
  }
})();