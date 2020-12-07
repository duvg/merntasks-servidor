const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Leer el token del heaeder
    const token = req.header('x-auth-token');

    // Rervisar si no hay token
    if ( ! token) {
        res.status(401).json({msg: 'Token invalido, permiso denegado'});
    }


    // Validar el token
    try {
        const encode = jwt.verify(token, process.env.SECRET);
        req.user = encode.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: 'Token no valido'});
    }
}