/**
 * 02 - TODO API con Postgres
 * Nivel: Intermedio
 *
 * Objetivo:
 * - Reemplazar el array en memoria de la practica 01 por persistencia real en Postgres
 * - Levantar Node + Postgres juntos con Docker Compose (dos contenedores, una red)
 * - Usar el driver "pg" con queries parametrizadas (evitar SQL injection)
 * - Comprobar que los datos sobreviven a un restart del contenedor de la API
 *   (mientras no se borre el volumen de Postgres)
 *
 * Requisitos previos: Docker y Docker Compose instalados.
 * Como correr esta practica: ver README.md
 */

import express from 'express'
import { pool } from './db.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

//* GET /tasks - Listar todas las tareas (con filtro opcional ?status=pending y paginación ?limit=10&offset=0)
app.get('/tasks', async (req, res) => {
    try {
        const { status, limit = 10, offset = 0 } = req.query
        
        let queryStr = 'SELECT * FROM tasks'
        const queryParams = []
        let paramIndex = 1

        if (status) {
            queryStr += ` WHERE status = $${paramIndex}`
            queryParams.push(status)
            paramIndex++
        }

        // * Paginacion (Bonus)
        queryStr += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
        queryParams.push(limit, offset)

        const result = await pool.query(queryStr, queryParams)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /tasks/:id - Obtener una tarea por id
app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /tasks - Crear una nueva tarea
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body

        if (!title) {
            return res.status(400).json({ error: 'Title is required' })
        }

        // ! Validacion de status (Bonus)
        if (status && status !== 'pending' && status !== 'completed') {
            return res.status(400).json({ error: 'Status must be pending or completed' })
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, description, status, due_date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [title, description || '', status || 'pending', dueDate || null]
        )

        // * Respondemos 201 Created
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// * Actualizar una tarea existente
// ? Si enviamos valores en el body los actualizamos, sino dejamos los anteriores usando COALESCE
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, status, dueDate } = req.body

        // ! Validacion de status (Bonus)
        if (status && status !== 'pending' && status !== 'completed') {
            return res.status(400).json({ error: 'Status must be pending or completed' })
        }

        // * Actualizamos los campos recibidos
        const result = await pool.query(
            `UPDATE tasks
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 status = COALESCE($3, status),
                 due_date = COALESCE($4, due_date),
                 updated_at = NOW()
             WHERE id = $5
             RETURNING *`,
            [title, description, status, dueDate, id]
        )

        // ! Validamos que la tarea exista
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }

        // * Tarea actualizada con exito
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// * Eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params

        // * Eliminamos y devolvemos la fila borrada
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [id]
        )

        // ! Si no hay filas devueltas, significa que el id no existia
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }

        // * Respuesta 204 indica exito sin contenido en el body
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
    console.log(`📝 API endpoints available at /tasks`)
})
