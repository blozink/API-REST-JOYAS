const express = require('express');
const joyasRoutes = require('./joyas');

const app = express();

app.use((req, res, next) => {
    const now = new Date();
    console.log(`[${now.toISOString()}] Método: ${req.method}, Ruta: ${req.path}`);
    next();
});

app.use(express.json());

app.use('/joyas', joyasRoutes);

app.use('*', (req, res) => {
    res.status(404).send('La ruta solicitada no existe');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
