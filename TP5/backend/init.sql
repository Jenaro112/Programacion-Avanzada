-- * Script de inicialización de la base de datos

-- * Creamos la tabla de tareas con sus respectivas columnas y tipos de datos
CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,
  nombre_proyecto VARCHAR(255) NOT NULL,
  tipo_actividad VARCHAR(100) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  resumen VARCHAR(500) NOT NULL,
  descripcion TEXT,
  prioridad VARCHAR(50) NOT NULL DEFAULT 'Media',
  informador VARCHAR(255),
  persona_asignada VARCHAR(255),
  precondicion TEXT,
  fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_cierre DATE,
  sprint VARCHAR(100)
);

-- * Insertamos algunas tareas de ejemplo
INSERT INTO tareas (nombre_proyecto, tipo_actividad, estado, resumen, descripcion, prioridad, informador, persona_asignada)
VALUES 
  ('Proyecto Alpha', 'Feature', 'Pendiente', 'Implementar login de usuarios', 'Crear formulario de login y conectar con el backend de autenticación.', 'Alta', 'Juan Pérez', 'María Gómez'),
  ('Proyecto Alpha', 'Bug', 'En Progreso', 'Arreglar error en el carrito', 'El botón de checkout no funciona en dispositivos móviles.', 'Crítica', 'Ana López', 'Carlos Ruiz'),
  ('Proyecto Beta', 'Documentación', 'Finalizada', 'Escribir manual de usuario', 'Documentar todas las funcionalidades del nuevo módulo.', 'Baja', 'Pedro Sánchez', 'Laura Martínez');
