const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) => {
    // Revisar si hay errores
    const errors = validationResult(req);
    if ( ! errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array() });
    }

    // Extraer el email y el password 
    const { email, password } = req.body;
    try {
        // Revisar que el usaurio este registrado
        let user = await User.findOne({ email });
        
        if ( ! user ) {
            return res.status(404).json({msg: 'El usuario no existe'});
        }

        // Verificar el password
        const passCheck = await bcryptjs.compare(password, user.password);
        if( ! passCheck ) {
            return res.status(400).json({msg: 'Password incorrecto'});
        }

        // Crear y firmar el JWT
        const payload = {
            user: {
                id: user.id,
                name: user.name
            }
        };

        // Firmar el jsonwebtoken
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if (error) throw error;

            // Respuesta
            res.json({ token });

        });


    } catch (error) {
        console.log(error);
    }
}

// Obtiene el usuaro autenticado

exports.userAuthenticated = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Ocurrio un error'});
    }
}