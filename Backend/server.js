const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: '¡Servidor de Capfit Gym funcionando correctamente!' });
});

app.get('/api/productos', (req, res) => {
    const productos = [
        { id: 1, nombre: "Proteína Whey Capfit 1kg", precio: 45000 },
        { id: 2, nombre: "Creatina Monohidrato 300g", precio: 32000 },
        { id: 3, nombre: "Shaker Oficial Capfit Gym", precio: 8500 },
        { id: 4, nombre: "Remera Oversize Entrená", precio: 18000 }
    ];
    res.json(productos);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});