const { pool } = require('../db');

// * Definimos los valores válidos para las validaciones
const ESTADOS_VALIDOS = ['Pendiente', 'En Progreso', 'En Revisión', 'Finalizada', 'Cancelada'];
const PRIORIDADES_VALIDAS = ['Baja', 'Media', 'Alta', 'Crítica'];
const TIPOS_ACTIVIDAD_VALIDOS = ['Bug', 'Feature', 'Mejora', 'Investigación', 'Documentación', 'Testing'];

// * Controlador para obtener todas las tareas
const obtenerTareas = async (req, res) => {
  try {
    // * Hacemos un SELECT de todas las tareas ordenadas por ID descendente
    const result = await pool.query('SELECT * FROM tareas ORDER BY id DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    // ! En caso de error, devolvemos un status 500 y el mensaje de error
    console.error('Error en obtenerTareas:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// * Controlador para obtener una sola tarea por su ID
const obtenerTarea = async (req, res) => {
  const { id } = req.params;
  try {
    // * Usamos consultas parametrizadas ($1) para prevenir inyección SQL
    const result = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      // ? Si no hay resultados, la tarea no existe (404 Not Found)
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en obtenerTarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// * Controlador para crear una nueva tarea
const crearTarea = async (req, res) => {
  const { 
    nombre_proyecto, tipo_actividad, resumen, descripcion, 
    prioridad = 'Media', informador, persona_asignada, 
    precondicion, sprint 
  } = req.body;

  // * Validamos los campos obligatorios
  if (!nombre_proyecto || !tipo_actividad || !resumen) {
    return res.status(400).json({ success: false, error: 'nombre_proyecto, tipo_actividad y resumen son obligatorios' });
  }

  // * Validamos que el tipo de actividad y prioridad sean valores permitidos
  if (!TIPOS_ACTIVIDAD_VALIDOS.includes(tipo_actividad)) {
    return res.status(400).json({ success: false, error: `tipo_actividad debe ser uno de: ${TIPOS_ACTIVIDAD_VALIDOS.join(', ')}` });
  }
  
  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
    return res.status(400).json({ success: false, error: `prioridad debe ser uno de: ${PRIORIDADES_VALIDAS.join(', ')}` });
  }

  try {
    // * Insertamos la tarea y retornamos el registro completo usando RETURNING *
    const result = await pool.query(
      `INSERT INTO tareas (
        nombre_proyecto, tipo_actividad, resumen, descripcion, 
        prioridad, informador, persona_asignada, precondicion, sprint
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nombre_proyecto, tipo_actividad, resumen, descripcion, prioridad, informador, persona_asignada, precondicion, sprint]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en crearTarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// * Controlador para actualizar una tarea existente
const actualizarTarea = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre_proyecto, tipo_actividad, estado, resumen, descripcion, 
    prioridad, informador, persona_asignada, precondicion, sprint 
  } = req.body;

  // * Validamos campos requeridos básicos para actualización
  if (!nombre_proyecto || !tipo_actividad || !resumen) {
    return res.status(400).json({ success: false, error: 'nombre_proyecto, tipo_actividad y resumen son obligatorios' });
  }

  // * Validaciones de valores permitidos
  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ success: false, error: `estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` });
  }
  if (!TIPOS_ACTIVIDAD_VALIDOS.includes(tipo_actividad)) {
    return res.status(400).json({ success: false, error: `tipo_actividad debe ser uno de: ${TIPOS_ACTIVIDAD_VALIDOS.join(', ')}` });
  }
  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
    return res.status(400).json({ success: false, error: `prioridad debe ser uno de: ${PRIORIDADES_VALIDAS.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `UPDATE tareas SET 
        nombre_proyecto = $1, 
        tipo_actividad = $2, 
        estado = $3, 
        resumen = $4, 
        descripcion = $5, 
        prioridad = $6, 
        informador = $7, 
        persona_asignada = $8, 
        precondicion = $9, 
        sprint = $10
      WHERE id = $11 RETURNING *`,
      [
        nombre_proyecto, tipo_actividad, estado || 'Pendiente', resumen, descripcion, 
        prioridad || 'Media', informador, persona_asignada, precondicion, sprint, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en actualizarTarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// * Controlador para eliminar una tarea
const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tareas WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en eliminarTarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// * Controlador para marcar una tarea como finalizada
const finalizarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    // * Primero verificamos si la tarea existe y su estado actual
    const checkResult = await pool.query('SELECT estado FROM tareas WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    // * Si ya está finalizada, retornamos un 400 Bad Request
    if (checkResult.rows[0].estado === 'Finalizada') {
      return res.status(400).json({ success: false, error: 'La tarea ya se encuentra finalizada' });
    }

    // * Actualizamos el estado a 'Finalizada' y fecha_cierre a hoy
    const result = await pool.query(
      `UPDATE tareas SET estado = 'Finalizada', fecha_cierre = CURRENT_DATE WHERE id = $1 RETURNING *`,
      [id]
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en finalizarTarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerTareas,
  obtenerTarea,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  finalizarTarea
};
