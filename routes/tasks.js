const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crear una tarea
// api/tasks
router.post('/',
    auth,
    [
        check('name', 'El Nombre es requerido').not().isEmpty(),
        check('project', 'El Proyecto es requerido').not().isEmpty()
    ],
    taskController.newTask
);

// Obtener las tareas por proyecto
router.get('/',
    auth,
    taskController.getTasks
);

// Actualizar una tarea
router.put('/:id',
    auth,
    taskController.updateTask
);

// Eliminar una tarea
router.delete('/:id',
    auth,
    taskController.deleteTask
);

module.exports = router;