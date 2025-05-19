const express = require("express")
const app = express()
const router = express.Router()
const pool = require('../db/db')

const bodyParser = require('body-parser');

app.use(express.json())
app.use(bodyParser.json());

// Endpoints

// GET - Obtención de todas las sucursales
router.get('/todas', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    try {
        const result = await pool.query(`SELECT * FROM sucursal ORDER BY id_sucursal`);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al consultar sucursales:', err);
        res.status(500).json({ error: 'Error al consultar sucursales' });
    }
});

app.use(router);
module.exports = router