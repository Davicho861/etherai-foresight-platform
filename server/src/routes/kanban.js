import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/kanban/board - Obtener el estado completo del tablero Kanban
router.get('/board', async (req, res) => {
  try {
    const tasks = await prisma.kanbanTask.findMany({
      orderBy: [
        { status: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    // Organizar tareas por columnas
    const columns = {
      PLANNING: { name: 'PLANNING', tasks: [] },
      DESIGN: { name: 'DESIGN', tasks: [] },
      IMPLEMENTATION: { name: 'IMPLEMENTATION', tasks: [] },
      TESTING: { name: 'TESTING', tasks: [] },
      DEPLOYMENT: { name: 'DEPLOYMENT', tasks: [] }
    };

    tasks.forEach(task => {
      if (columns[task.status]) {
        columns[task.status].tasks.push({
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          assignee: task.assignee,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        });
      }
    });

    res.json({
      success: true,
      columns: Object.values(columns),
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Kanban] Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch kanban board' });
  }
});

// PUT /api/kanban/tasks/:taskId - Actualizar una tarea (cambiar estado/columna)
router.put('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, order } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Validar que el status sea válido
    const validStatuses = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedTask = await prisma.kanbanTask.update({
      where: { id: taskId },
      data: {
        status,
        order: order !== undefined ? order : 0,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    console.error('[Kanban] Error updating task:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// POST /api/kanban/tasks - Crear una nueva tarea
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, priority, assignee } = req.body;

    if (!title || !status) {
      return res.status(400).json({ error: 'Title and status are required' });
    }

    // Validar status
    const validStatuses = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const newTask = await prisma.kanbanTask.create({
      data: {
        title,
        description: description || '',
        status,
        priority: priority || 'Medium',
        assignee: assignee || null,
        order: 0
      }
    });

    res.status(201).json({
      success: true,
      task: newTask
    });
  } catch (error) {
    console.error('[Kanban] Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// DELETE /api/kanban/tasks/:taskId - Eliminar una tarea
router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    await prisma.kanbanTask.delete({
      where: { id: taskId }
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('[Kanban] Error deleting task:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;