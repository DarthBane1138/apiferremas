const { PORT } = require('./config.js');
const express = require('express');
const app = express();
const cors = require("cors")

app.use(express.json());
app.use(cors())

// Acá se van a configurar las rutas referenciando a carpeta routes

// Ruta para endpoints productos
app.use("/apiferremas/productos", require("./routes/productos.js"));
// Rutas para endpoints sucursales
app.use("/apiferremas/sucursales", require("./routes/sucursales.js"));
// Rutas para endpoints contacto
app.use("/apiferremas/contacto", require("./routes/contacto.js"));
// Rutas para endpoints pedidos
app.use("/apiferremas/pedido", require("./routes/pedido.js"));

// Nueva ruta para divisas
app.use("/apiferremas/currency", require("./routes/currency.js"));


app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
    console.log(`http://localhost:${PORT}/apiferremas`); // No borrar pls
});

console.log("Variables cargadas:", {
    user: process.env.BCENTRAL_USER,
    db_name: process.env.DB_NAME,
    pass: process.env.BCENTRAL_PASS ? "***" : "undefined"
});