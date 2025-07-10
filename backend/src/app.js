import './config.js';
import express from 'express';
import cors from 'cors';
import { pool } from '../database/connectionMySQL.js';
import routes from '../routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Para recibir JSON y datos en formato URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS para los dominios que usamos en local
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

// Archivos estáticos para servir frontend y assets
app.use(express.static(path.join(__dirname, '../public')));

// Ruta específica para imágenes, para asegurarnos que se puedan acceder bien
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Rutas de la API
app.use('/api', routes);

// Levanto el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});

// Verifico conexión a la base antes de arrancar todo
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Conexión establecida con MySQL");
    conn.release();
  } catch (err) {
    console.error("No se pudo conectar a la base de datos:", err);
    process.exit(1);
  }
})();
