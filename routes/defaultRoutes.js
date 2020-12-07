var express = require('express');

var router = express.Router();

// Página de inicio
router.get('/', (req, res) => {
    res.send('HOLA XD');
});


module.exports = router;