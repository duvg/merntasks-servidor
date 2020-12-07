const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Crea un nuevo proyecto
exports.newProject = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if ( ! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const project = new Project(req.body);

        // Asignar el creador via JWT
        project.owner = req.user.id;

        // Guardar el proyecto
        project.save();
        res.status(201).json(project);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
}

// Obtener todos los proyectos del usuario autenticado
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1});
        res.json({projects});
    } catch (error) {
        res.status(500).send('Ocurrio un error');
        console.log(error);
    }
}

// Actualizar un proyecto
exports.updateProject = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if ( ! errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer la información del proyecto
    const { name } = req.body;
    const newProject = {};

    if (name) {
        newProject.name = name;
    }

    try {

        // Verificar si el proyecto existe
        let project = await Project.findById(req.params.id);

        if ( ! project ) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        } 

        // Verficar si el usuario es el crador del proyecto
        if ( project.owner.toString() !== req.user.id ) {
            return res.status(401).json({msg: 'Acceso denegado'});
        }

        // Actualizar
        project = await Project.findOneAndUpdate({_id: req.params.id}, { $set: newProject }, { new: true });

        return res.status(200).json({project});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}


exports.deleteProject = async (req, res) => {

    try {

        // Verificar si el proyecto existe
        let project = await Project.findById(req.params.id);

        if ( ! project ) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Verficar si el usuario es el crador del proyecto
        
        if ( project.owner.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Acceso denegado'});
        }

        // Eliminar el proyecto
        await Project.findOneAndRemove({_id: req.params.id});
        res.status(200).json({msg: 'Projecto eliminado'});


    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Ocurrio un error'});
    }


}