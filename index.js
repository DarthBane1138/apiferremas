const { PORT } = require('./config.js');
const express = require('express');
const app = express();
const cors = require("cors")

app.use(express.json());
app.use(cors())

// Acá se van a configurar las rutas referenciando a carpeta routes
//app.use("/apiferremas/nombre", require("./routes/nombre.js"));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
    console.log(`http://localhost:${PORT}/apiferremas`); // No borrar pls
});