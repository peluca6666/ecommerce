import express from 'express';
import cors from 'cors';
import { pool } from '../database/connectionMySQL.js';
import dotenv from 'dotenv';
import routes from '../routes/routes.js';

dotenv.config();

const app = express();

// Configurar CORS antes de otros middlewares
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir sin origin (Postman, curl) o cualquier localhost
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

if (process.env.NODE_ENV === 'development') {
  app.use(cors(corsOptions));
} else {
  app.use(cors({
    origin: 'https://tu-dominio-en-produccion.com', // reemplazá esto cuando lo tengas
    credentials: true
  }));
}

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
  } catch (err) {
    console.error("❌ No se pudo conectar a la base de datos:", err);
    process.exit(1);
  }
})();
