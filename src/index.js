import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import indexRoutes from './routes/index.routes.js';
import * as dataModel from './models/data.model.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './src/views');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../Public')));

// Configuración de sesiones
app.use(session({
    secret: 'sgee-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // En producción con HTTPS, cambiar a true
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware para pasar datos de sesión a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.cartCount = req.session.cart 
        ? req.session.cart.reduce((sum, item) => sum + item.quantity, 0)
        : 0;
    // Pasar categorías para que estén disponibles en el header
    res.locals.categories = dataModel.getAllCategories();
    // Pasar filtro de categoría desde query string
    res.locals.categoriaFiltro = req.query.categoria || 'todas';
    next();
});

// Rutas
app.use('/', indexRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});