const { Router } = require('express');
const { 
  obtenerTareas, 
  obtenerTarea, 
  crearTarea, 
  actualizarTarea, 
  eliminarTarea, 
  finalizarTarea 
} = require('../controllers/tareas.controller');

const router = Router();

// * Las rutas siguen las convenciones REST para una API limpia
// * GET para leer datos
// * POST para crear
// * PUT para actualizar completamente un recurso
// * DELETE para borrar
// * PATCH para modificaciones parciales

// * Ruta para obtener todas las tareas (GET /api/tareas)
router.get('/', obtenerTareas);

// * Ruta para obtener una tarea por su ID (GET /api/tareas/:id)
router.get('/:id', obtenerTarea);

// * Ruta para crear una nueva tarea (POST /api/tareas)
router.post('/', crearTarea);

// * Ruta para actualizar una tarea existente (PUT /api/tareas/:id)
router.put('/:id', actualizarTarea);

// * Ruta para eliminar una tarea por su ID (DELETE /api/tareas/:id)
router.delete('/:id', eliminarTarea);

// * Ruta para marcar una tarea como finalizada (PATCH /api/tareas/:id/finalizar)
// ? Se usa PATCH porque es una modificación parcial de la tarea (solo cambia estado y fecha)
router.patch('/:id/finalizar', finalizarTarea);

module.exports = router;
