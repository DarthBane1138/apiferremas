const express = require("express")
const app = express()
const router = express.Router()
const pool = require('../db/db')

const bodyParser = require('body-parser');

app.use(express.json())
app.use(bodyParser.json());

// Endpoints

// 01. GET - Obtención de productos
router.get('/todos', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    try {
        const result = await pool.query(`SELECT * FROM producto`);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al consultar productos:', err);
        res.status(500).json({ error: 'Error al consultar productos' });
    }
});

// 02. GET: Obtener todas las categorías de los productos
router.get('/categorias', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    try {
      const result = await pool.query('SELECT * FROM categoria ORDER BY id_categoria');
      res.json(result.rows);
    } catch (err) {
      console.error('Error al consultar categorías:', err);
      res.status(500).json({ error: 'Error al consultar categorías' });
    }
  });

// 03. GET: Obtener stock de una sucursal por su ID
router.get('/stock_sucursal/:id', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    const sucursalId = parseInt(req.params.id, 10);
  
    if (isNaN(sucursalId)) {
      return res.status(400).json({ error: 'ID de sucursal inválido.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * FROM fn_obtener_stock_sucursal($1)',
        [sucursalId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener stock por sucursal:', err);
      res.status(500).json({ error: 'Error al consultar stock por sucursal.' });
    }
  });

// 04. POST: Obtener stock por sucursal y categoría
router.post('/stock_categoria_sucursal', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    const { id_sucursal, id_categoria } = req.body;
  
    if (!id_sucursal || !id_categoria) {
      return res.status(400).json({ error: 'Faltan parámetros: id_sucursal y id_categoria son requeridos.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * FROM fn_obtener_stock_sucursal_categoria($1, $2)',
        [id_sucursal, id_categoria]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error al consultar stock por sucursal y categoría:', err);
      res.status(500).json({ error: 'Error interno al obtener stock.' });
    }
  });


// 05. GET: Obtener información de un producto y su historial de precios
router.get('/producto_info/:id', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    const id_producto = parseInt(req.params.id, 10);
  
    if (isNaN(id_producto)) {
      return res.status(400).json({ error: 'El parámetro id del producto debe ser un número válido.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * FROM fn_obtener_producto($1)',
        [id_producto]
      );
  
      // Formatear la fecha a 'YYYY-MM-DD'
      const formattedRows = result.rows.map(row => ({
        ...row,
        fecha: row.fecha ? new Date(row.fecha).toISOString().split('T')[0] : null
      }));
  
      res.json(formattedRows);
    } catch (err) {
      console.error('Error al consultar información del producto:', err);
      res.status(500).json({ error: 'Error interno al consultar el producto.' });
    }
  });


app.use(router);
module.exports = router