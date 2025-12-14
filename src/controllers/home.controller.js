// Controlador del home

import * as dataModel from '../models/data.model.js';

export const renderHome = (req, res) => {
    // Obtener productos del modelo compartido (sincronizados con admin)
    const productsData = dataModel.getAllProducts();
    
    // Obtener categoría del query string si existe
    const categoriaFiltro = req.query.categoria || 'todas';
    
    // Filtrar productos por categoría si se especifica
    let productosFiltrados = productsData;
    if (categoriaFiltro && categoriaFiltro !== 'todas') {
        productosFiltrados = productsData.filter(p => p.categoria === categoriaFiltro);
    }
    
    // Convertir al formato que espera la vista del cliente
    const products = productosFiltrados.map(product => ({
        id: product.id,
        title: product.nombre,
        description: product.descripcion,
        price: product.precio,
        categoria: product.categoria,
        icon: product.icon || 'fas fa-box'
    }));
    
    // Obtener todas las categorías para el filtro
    const categories = dataModel.getAllCategories();
    
    // Obtener cantidad de items en el carrito
    const cartCount = req.session.cart 
        ? req.session.cart.reduce((sum, item) => sum + item.quantity, 0)
        : 0;
    
    res.render('home', {
        title: 'SGEE - Inicio',
        products: products,
        categories: categories,
        categoriaFiltro: categoriaFiltro,
        cartCount: cartCount,
        user: req.session.user || null
    });
};
