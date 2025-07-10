import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '.env');

dotenv.config({ path: envPath });

console.log(`[Config] Cargando .env desde: ${envPath}`);
console.log(`[Config] Token leído: ${process.env.MERCADOPAGO_ACCESS_TOKEN ? 'OK' : 'FALLÓ'}`);