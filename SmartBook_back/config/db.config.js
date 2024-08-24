import { createPool } from 'mysql2';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo correspondiente
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Creación de un pool de conexiones
const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000, // 10 segundos
});

// Función para obtener una conexión del pool
export function getConnection() {
  return pool.promise();
}

export default pool;