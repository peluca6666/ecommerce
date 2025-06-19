import multer from 'multer';
import path from 'path'; 
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // CORREGIDO: Usar 'productos' consistentemente
    const uploadPath = path.join(__dirname, '../public/images/productos');
    
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });