import express, { urlencoded, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import categoriaRoutes from './src/routes/categoria.routes.js';
import CompraProductoRoutes from './src/routes/compra_producto.routes.js';
import productoRoutes from './src/routes/producto.routes.js';
import TipoCategoriaRoutes from './src/routes/tipo_categoria.routes.js';
import compraRoutes from './src/routes/compra.routes.js';
import usuarioRoutes from './src/routes/usuario.routes.js';
import unidadMedidaRoutes from './src/routes/unidad_medida.routes.js';
import { getConnection } from './config/db.config.js';

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
      title: 'MyHomeStock API',
      version: '1.0.0',
      description: 'API para gestionar el stock de productos del hogar',
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
  res.send("¡Bienvenido a la API de MyHomeStock!");
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
app.use('/api/v1/categoria', categoriaRoutes);
app.use('/api/v1/compra_producto', CompraProductoRoutes);
app.use('/api/v1/producto', productoRoutes);
app.use('/api/v1/tipo_categoria', TipoCategoriaRoutes);
app.use('/api/v1/compra', compraRoutes);
app.use('/api/v1/usuario', usuarioRoutes);
app.use('/api/v1/unidad_medida', unidadMedidaRoutes);

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