import express from 'express';
import { pool } from '../backend/database/connectionMySQL.js';
import dotenv from 'dotenv';
import routes from '../backend/routes/routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conexión establecida con MySQL");
    conn.release();
    // No cerrar el proceso acá, el servidor tiene que seguir corriendo
    // process.exit(0);
  } catch (err) {
    console.error("❌ No se pudo conectar a la base de datos:", err);
    process.exit(1);
  }
})();