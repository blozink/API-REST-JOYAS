const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'juanca',
    host: 'localhost',
    database: 'joyas',
    password: '',
    port: 5432,
});

const prepararHATEOAS = (joyas) => ({
    total: joyas.length,
    results: joyas.map((j) => ({
        name: j.nombre,
        href: `/joyas/${j.id}`,
    })),
});

router.get('/', async (req, res) => {
    try {
        const { limits = 10, page = 1, order_by = 'id_ASC' } = req.query;
        const [campo, direccion] = order_by.split('_');
        const offset = (page - 1) * limits;

        const query = `SELECT * FROM inventario ORDER BY ${campo} ${direccion} LIMIT $1 OFFSET $2`;
        const { rows } = await pool.query(query, [limits, offset]);

        res.json(prepararHATEOAS(rows));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/filtros', async (req, res) => {
    try {
        const { precio_max, precio_min, categoria, metal } = req.query;
        const filtros = [];
        const values = [];

        if (precio_max) {
            filtros.push(`precio <= $${filtros.length + 1}`);
            values.push(precio_max);
        }
        if (precio_min) {
            filtros.push(`precio >= $${filtros.length + 1}`);
            values.push(precio_min);
        }
        if (categoria) {
            filtros.push(`categoria = $${filtros.length + 1}`);
            values.push(categoria);
        }
        if (metal) {
            filtros.push(`metal = $${filtros.length + 1}`);
            values.push(metal);
        }

        const query = `
            SELECT * FROM inventario 
            ${filtros.length ? `WHERE ${filtros.join(' AND ')}` : ''}
        `;
        const { rows } = await pool.query(query, values);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
