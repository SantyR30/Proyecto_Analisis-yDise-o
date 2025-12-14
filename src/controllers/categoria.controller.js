// Controlador de categorías

import * as dataModel from '../models/data.model.js';

export const renderCategories = (req, res) => {
    // Verificar autenticación y tipo de usuario
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.redirect('/login');
    }
    
    const categories = dataModel.getAllCategories();
    const totalCategories = categories.length;
    
    res.render('admin/categorias', {
        title: 'SGEE - Gestión de Categorías',
        user: req.session.user,
        categories: categories,
        totalCategories: totalCategories
    });
};

export const renderAddCategory = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.redirect('/login');
    }
    
    res.render('admin/add-category', {
        title: 'SGEE - Agregar Categoría',
        user: req.session.user
    });
};

export const createCategory = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    const { nombre, descripcion, icon } = req.body;
    
    // Validación básica
    if (!nombre || !descripcion) {
        return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }
    
    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = dataModel.getCategoryByName(nombre);
    if (existingCategory) {
        return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    
    // Crear nueva categoría usando el modelo compartido
    const newCategory = dataModel.addCategory({
        nombre: nombre,
        descripcion: descripcion,
        icon: icon || 'fas fa-box',
        activa: true
    });
    
    // Redirigir a la lista de categorías después de crear
    res.redirect('/admin/categorias');
};

export const renderEditCategory = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.redirect('/login');
    }
    
    const categoryId = parseInt(req.params.id);
    const category = dataModel.getCategoryById(categoryId);
    
    if (!category) {
        return res.redirect('/admin/categorias');
    }
    
    res.render('admin/edit-category', {
        title: 'SGEE - Editar Categoría',
        user: req.session.user,
        category: category
    });
};

export const updateCategory = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    const categoryId = parseInt(req.params.id);
    const { nombre, descripcion, icon, activa } = req.body;
    
    // Verificar si el nombre ya existe en otra categoría
    const existingCategory = dataModel.getCategoryByName(nombre);
    if (existingCategory && existingCategory.id !== categoryId) {
        return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    
    const updatedCategory = dataModel.updateCategory(categoryId, {
        nombre: nombre,
        descripcion: descripcion,
        icon: icon || 'fas fa-box',
        activa: activa === 'true' || activa === true
    });
    
    if (!updatedCategory) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    // Redirigir a la lista de categorías después de actualizar
    res.redirect('/admin/categorias');
};

export const deleteCategory = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'administrador') {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    const categoryId = parseInt(req.params.id);
    const result = dataModel.deleteCategory(categoryId);
    
    if (!result) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    // Redirigir a la lista de categorías después de eliminar
    res.redirect('/admin/categorias');
};

