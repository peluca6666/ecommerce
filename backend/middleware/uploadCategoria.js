import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Definimos la ruta específica para las imágenes de categorías
    const uploadPath = path.join(__dirname, '../public/images/categorias');
    
    // Aseguramos que el directorio exista
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Usamos el nombre del campo 'imagen' para consistencia
    cb(null, 'imagen-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadCategoria = multer({ storage: storage });