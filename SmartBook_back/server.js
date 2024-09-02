import express, { urlencoded, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { getConnection } from './config/db.config.js';

// Rutas
import usuarioRoutes from './src/routes/usuario.routes.js';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan('dev'));

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartBook API',
      version: '1.0.0',
      description: 'API para realizar lista de compra y poder llevar un control financiero',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Ruta a los archivos de rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.send("¡Bienvenido a la API de SmartBook!");
});

app.get('/test', async (req, res) => {
  try {
    const connection = getConnection();
    const [rows, fields] = await connection.query('SELECT 1 + 1 AS solution');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enrutamientos
app.use('/api/v1/calendario', calendarioRoutes);
app.use('/api/v1/cartera', carteraRoutes);
app.use('/api/v1/lista-compra', listaCompraRoutes);
app.use('/api/v1/notas', notasRoutes);
app.use('/api/v1/objetivos', objetivosRoutes);
app.use('/api/v1/presupuesto', presupuestoRoutes);
app.use('/api/v1/recordatorios', recordatoriosRoutes);
app.use('/api/v1/usuario', usuarioRoutes);

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: true, message: 'Formato JSON inválido.' });
  }
  res.status(err.status || 500).send({
    error: true,
    message: err.message || 'Algo salió mal!'
  });
});

const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

export { app, server };