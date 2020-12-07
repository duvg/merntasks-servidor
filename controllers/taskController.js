const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');
const router = require('../routes/defaultRoutes');


exports.getTask = async (req, res) => {
    return res.json({d: '22'});
}

// Crear una nueva terea
exports.newTask = async (req, res) => {

    // Validar los datos
    const errors = validationResult(req);
    if ( ! errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }


    try {
        // Extraer el proyecto y comproabr si existe
        const { project } = req.body;

        const user_project = await Project.findById(project);
        if ( ! user_project ) {
            return res.status(404).json({ msg: `No existe el proyecto con id: ${project}` });
        } 

        // Verficar si el usuario es el crador del proyecto
        if ( user_project.owner.toString() !== req.user.id ) {
            return res.status(401).json({msg: 'Acceso denegado'});
        }

        // Crear la tarea
        const task = new Task(req.body);
        await task.save();

        return res.status(201).json(task);



    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }

}

// Obtener las tareas por proyecto
exports.getTasks = async (req, res) => {

    try {
        // Extraer el proyecto y comproabr si existe
        let { project } = req.query;

        const userProject = await Project.findById(project);

        if ( ! userProject ) {
            return res.status(404).json({ msg: `No existe un proyecto con el id: ${project}`});
        }

        // Verificar si el usuario es el creador del proyecto
        if(userProject.owner.toString() !== req.user.id) {
            return res.status(401).json('Acceso denegado');
        }

        // Obtener las tareas por proyecto
        const tasks = await Task.find({ project: project }).sort({createdAt: -1});
        res.status(200).json({tasks});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
}


// Actualizar una tarea
exports.updateTask = async (req, res) => {

    
    try {
        // Extraer el proyecto y comproabr si existe
        let { project, name, status } = req.body;

        // Verificar si la tarea existe
        let task = await Task.findById(req.params.id);

        if ( ! task ) {
            return res.status(404).json('No existe la tarea');
        }
        
        // Extraer proyecto
        const userProject = await Project.findById(project);

        // Verificar si el usuario es el creador del proyecto
        if(userProject.owner.toString() !== req.user.id) {
            return res.status(401).json('Acceso denegado');
        }

        // Crear un objeto con la nueva información
        const newTask = {};

        newTask.name = name;
        newTask.status = status;

        // Guardar la tarea
        task = await Task.findOneAndUpdate({ _id: req.params.id}, newTask, { new: true});

        return res.status(200).json(task);


    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un errior');
    }
}

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        // Extraer el proyecto y comproabr si existe
        let { project } = req.query;

        // Verificar si la tarea existe
        let task = await Task.findById(req.params.id);

        if ( ! task ) {
            return res.status(404).json('No existe la tarea');
        }
        
        // Extraer proyecto
        const userProject = await Project.findById(project);

        // Verificar si el usuario es el creador del proyecto
        if(userProject.owner.toString() !== req.user.id) {
            return res.status(401).json('Acceso denegado');
        }

        // Eliminar la tarea
        await Task.findOneAndRemove({_id: req.params.id});
        res.status(200).json({msg: 'Tarea eliminada'})


    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un errior');
    }
}