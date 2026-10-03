// * Cargamos las variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const tareasRoutes = require('./routes/tareas.routes');

// * Inicializamos la aplicación Express
const app = express();

// * Configuramos CORS para permitir peticiones desde el frontend
// * Si no se define origen en entorno, permite http://localhost:5173 por defecto
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

// * Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// * Montamos las rutas de nuestra API REST
// * Todas las rutas de tareas tendrán el prefijo /api/tareas
app.use('/api/tareas', tareasRoutes);

// * Obtenemos el puerto de las variables de entorno o usamos 3001 por defecto
const PORT = process.env.PORT || 3001;

// * Función principal para arrancar el servidor
const startServer = async () => {
  // * Probamos la conexión a la base de datos antes de escuchar peticiones
  await testConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
  });
};

startServer();
