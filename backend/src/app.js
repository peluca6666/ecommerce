import express from 'express';
import cors from 'cors';
import { pool } from '../database/connectionMySQL.js';
import dotenv from 'dotenv';
import routes from '../routes/routes.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargamos variables de entorno desde el archivo .env
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();

//middlewares de body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS 
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177', 
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5177'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

//ruta para servir archivos estaticos 
app.use('/public', express.static('public'));

//rutas de la api
app.use('/api', routes);

//levanta el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Conexión establecida con MySQL");
    conn.release();
  } catch (err) {
    console.error(" No se pudo conectar a la base de datos:", err);
    process.exit(1);
  }
})();