import express from 'express';
const router = express.Router();

// Ruta principal - Página de inicio
router.get('/', (req, res) => {
    res.render('home', { title: 'SGEE - Inicio' });
});

// Ruta del carrito
router.get('/carrito', (req, res) => {
    res.render('carrito', { title: 'SGEE - Carrito de Compras' });
});

// Ruta del carrito vacío
router.get('/carrito-vacio', (req, res) => {
    res.render('carrito-vacio', { title: 'SGEE - Carrito Vacío' });
});

// Ruta de confirmación
router.get('/confirmacion', (req, res) => {
    res.render('confirmacion', { title: 'SGEE - Orden Confirmada' });
});

// Ruta de login
router.get('/login', (req, res) => {
    res.render('login', { title: 'SGEE - Iniciar Sesión' });
});

// Ruta de registro
router.get('/registro', (req, res) => {
    res.render('registro', { title: 'SGEE - Registrarse' });
});

export default router;


