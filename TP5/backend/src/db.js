const { Pool } = require('pg');
require('dotenv').config();

// * El Connection Pool (Grupo de conexiones) permite reutilizar las conexiones a la base de datos
// * en lugar de abrir y cerrar una conexión nueva para cada consulta.
// * Esto mejora significativamente el rendimiento de la aplicación.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// * Función para probar la conexión al iniciar el servidor
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    client.release(); // * Siempre debemos liberar el cliente después de usarlo
  } catch (error) {
    // ! Si hay un error al conectar, lo mostramos en consola
    console.error('❌ Error al conectar con la base de datos:', error.message);
  }
};

module.exports = {
  pool,
  testConnection
};
