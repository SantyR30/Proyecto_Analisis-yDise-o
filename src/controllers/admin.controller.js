// Controlador de administrador

import * as dataModel from '../models/data.model.js';

export const renderDashboard = (req, res) => {
    // Verificar autenticación y tipo de usuario
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.redirect('/login');
    }
    
    const products = dataModel.getAllProducts();
    const categories = dataModel.getAllCategories();
    const totalProductos = products.length;
    const totalOrdenes = dataModel.getAllOrders().length;
    const ingresosTotales = products.reduce((sum, p) => sum + p.precio, 0);
    
    res.render('admin/dashboard', {
        title: 'SGEE - Panel de Administrador',
        user: req.session.user,
        products: products,
        categories: categories,
        totalProductos: totalProductos,
        totalOrdenes: totalOrdenes,
        ingresosTotales: ingresosTotales
    });
};

export const renderAddProduct = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.redirect('/login');
    }
    
    res.render('admin/add-product', {
        title: 'SGEE - Agregar Producto',
        user: req.session.user
    });
};

export const createProduct = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    const { nombre, descripcion, precio, categoria } = req.body;
    
    // Validación básica
    if (!nombre || !descripcion || !precio || !categoria) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Crear nuevo producto usando el modelo compartido
    const newProduct = dataModel.addProduct({
        nombre: nombre,
        descripcion: descripcion,
        precio: parseFloat(precio),
        categoria: categoria,
        imagen: null, // En producción se procesaría la imagen
        icon: 'fas fa-box' // Icono por defecto
    });
    
    // Redirigir al dashboard después de crear
    res.redirect('/admin/dashboard');
};

export const renderEditProduct = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.redirect('/login');
    }
    
    const productId = parseInt(req.params.id);
    const product = dataModel.getProductById(productId);
    
    if (!product) {
        return res.redirect('/admin/dashboard');
    }
    
    res.render('admin/edit-product', {
        title: 'SGEE - Editar Producto',
        user: req.session.user,
        product: product
    });
};

export const updateProduct = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    const productId = parseInt(req.params.id);
    const { nombre, descripcion, precio, categoria } = req.body;
    
    const updatedProduct = dataModel.updateProduct(productId, {
        nombre: nombre,
        descripcion: descripcion,
        precio: parseFloat(precio),
        categoria: categoria
    });
    
    if (!updatedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Redirigir al dashboard después de actualizar
    res.redirect('/admin/dashboard');
};

export const renderDeleteProduct = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.redirect('/login');
    }
    
    const productId = parseInt(req.params.id);
    const product = dataModel.getProductById(productId);
    
    if (!product) {
        return res.redirect('/admin/dashboard');
    }
    
    res.render('admin/delete-product', {
        title: 'SGEE - Eliminar Producto',
        user: req.session.user,
        product: product
    });
};

export const deleteProduct = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    const productId = parseInt(req.params.id);
    const deleted = dataModel.deleteProduct(productId);
    
    if (!deleted) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Redirigir al dashboard después de eliminar
    res.redirect('/admin/dashboard');
};
