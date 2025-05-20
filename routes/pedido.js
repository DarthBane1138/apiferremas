const express = require("express")
const app = express()
const router = express.Router()
const pool = require('../db/db')

const bodyParser = require('body-parser');

app.use(express.json())
app.use(bodyParser.json());

// Endpoints

// 01. POST: Crear un nuevo pedido con detalle de productos
router.post('/pedido_sucursal', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    const { sucursal_id, productos } = req.body;

    // Validaciones
    if (!sucursal_id || isNaN(parseInt(sucursal_id))) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'El campo sucursal_id es obligatorio y debe ser numérico.'
        });
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'Debe incluir al menos un producto en el pedido.'
        });
    }

    try {
        const result = await pool.query(
            'SELECT fn_insertar_pedido_con_detalle($1, $2)',
            [sucursal_id, JSON.stringify(productos)]
        );

        res.json({
            status: 'ok',
            mensaje: result.rows[0].fn_insertar_pedido_con_detalle
        });
    } catch (err) {
        console.error('Error al insertar pedido:', err);
        res.status(500).json({
            status: 'error',
            mensaje: 'Error interno al registrar el pedido.',
            detalle: err.message
        });
    }
});


app.use(router);
module.exports = router