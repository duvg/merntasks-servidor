// Rutas para crear usuarios
var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

// Crear usuario
router.post('/', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agreaga un email valido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
    ],
    userController.createUser
);

module.exports = router;