const express = require("express")
const app = express()
const router = express.Router()
const pool = require('../db/db')

const bodyParser = require('body-parser');

app.use(express.json())
app.use(bodyParser.json());

/*
Endpoints
- POST: Insertar un nuevo mensaje de contacto desde un formulario
- GET - Obtención de solicitudes de contacto
*/

// POST: Insertar un nuevo mensaje de contacto desde un formulario
router.post('/contacto', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
    const { nombre_cliente, correo_cliente, mensaje } = req.body;
  
    // Validaciones individuales
    if (!nombre_cliente) {
      return res.status(400).json({
        status: 'error',
        mensaje: 'El campo nombre_cliente es obligatorio.'
      });
    }
  
    if (!correo_cliente) {
      return res.status(400).json({
        status: 'error',
        mensaje: 'El campo correo_cliente es obligatorio.'
      });
    }
  
    if (!mensaje || mensaje.trim() === '') {
      return res.status(400).json({
        status: 'error',
        mensaje: 'El campo mensaje es obligatorio y no puede estar vacío.'
      });
    }
  
    try {
      const result = await pool.query(
        'SELECT fn_insertar_contacto_cliente($1, $2, $3)',
        [nombre_cliente, correo_cliente, mensaje]
      );
  
      res.json({
        status: 'ok',
        mensaje: result.rows[0].fn_insertar_contacto_cliente
      });
  
    } catch (err) {
      console.error('Error al registrar contacto del cliente:', err);
      res.status(500).json({
        status: 'error',
        mensaje: 'Error interno al registrar el mensaje. Inténtalo más tarde.',
        detalle: err.message
      });
    }
  });

// GET - Obtención de solicitudes de contacto
router.get('/todos', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    try {
        const result = await pool.query('SELECT * FROM contacto_cliente');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al consultar productos:', err);
        res.status(500).json({ error : 'Error al consultar contactos'});
    }
});

app.use(router);
module.exports = router;