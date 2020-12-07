const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crear projectos
// api/projects
router.post('/',
    auth,
    [
        check('name', 'El nombre del proyecto es requerido').not().isEmpty()
    ],
    projectController.newProject
);


// Obtener todos los proyectos
router.get('/', 
    auth,
    projectController.getProjects
);

// Actualizar un proyecto por ID
router.put('/:id',
    auth,
    [
        check('name', 'El nombre del proyecto es requerido').not().isEmpty()
    ],
    projectController.updateProject
);

// Elimianr un proyecto
router.delete('/:id',
    auth,
    projectController.deleteProject
);

module.exports = router;