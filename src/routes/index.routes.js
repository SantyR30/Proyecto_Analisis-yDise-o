import express from 'express';
const router = express.Router();

// Importar controladores
import * as homeController from '../controllers/home.controller.js';
import * as authController from '../controllers/auth.controller.js';
import * as cartController from '../controllers/cart.controller.js';
import * as adminController from '../controllers/admin.controller.js';
import * as proveedorController from '../controllers/proveedor.controller.js';
import * as notificacionesController from '../controllers/notificaciones.controller.js';
import * as perfilController from '../controllers/perfil.controller.js';
import * as categoriaController from '../controllers/categoria.controller.js';

// Rutas del home
router.get('/', homeController.renderHome);

// Rutas de autenticación
router.get('/login', authController.renderLogin);
router.post('/login', authController.login);
router.get('/registro', authController.renderRegister);
router.post('/registro', authController.register);
router.post('/logout', authController.logout);

// Rutas del carrito
router.get('/carrito', cartController.renderCart);
router.get('/carrito-vacio', cartController.renderEmptyCart);
router.post('/api/cart/add', cartController.addToCart);
router.put('/api/cart/update', cartController.updateCartItem);
router.delete('/api/cart/remove', cartController.removeFromCart);
router.post('/carrito/finalizar', cartController.finalizeOrder);
router.get('/confirmacion', cartController.renderConfirmation);

// Rutas de administrador
router.get('/admin/dashboard', adminController.renderDashboard);
router.get('/admin/productos/agregar', adminController.renderAddProduct);
router.post('/admin/productos/crear', adminController.createProduct);
router.get('/admin/productos/editar/:id', adminController.renderEditProduct);
router.post('/admin/productos/actualizar/:id', adminController.updateProduct);
router.get('/admin/productos/eliminar/:id', adminController.renderDeleteProduct);
router.post('/admin/productos/eliminar/:id', adminController.deleteProduct);

// Rutas de categorías
router.get('/admin/categorias', categoriaController.renderCategories);
router.get('/admin/categorias/agregar', categoriaController.renderAddCategory);
router.post('/admin/categorias/crear', categoriaController.createCategory);
router.get('/admin/categorias/editar/:id', categoriaController.renderEditCategory);
router.post('/admin/categorias/actualizar/:id', categoriaController.updateCategory);
router.post('/admin/categorias/eliminar/:id', categoriaController.deleteCategory);

// Rutas de proveedor
router.get('/proveedor/dashboard', proveedorController.renderDashboard);
router.post('/proveedor/ordenes/actualizar-estado', proveedorController.updateOrderStatus);

// Rutas de notificaciones
router.get('/notificaciones', notificacionesController.renderNotifications);

// Rutas de perfil
router.get('/perfil', perfilController.renderProfile);
router.post('/perfil/actualizar', perfilController.updateProfile);

export default router;



