// Controlador de proveedor

import * as dataModel from '../models/data.model.js';

export const renderDashboard = (req, res) => {
    // Verificar autenticación y tipo de usuario
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'proveedor') {
        return res.redirect('/login');
    }
    
    // Obtener todas las órdenes
    const allOrders = dataModel.getAllOrders();
    
    // Contar órdenes por estado
    const pendientes = dataModel.getOrdersByStatus('pendiente').length;
    const enPreparacion = dataModel.getOrdersByStatus('en_preparacion').length;
    const enEnvio = dataModel.getOrdersByStatus('en_envio').length;
    const entregados = dataModel.getOrdersByStatus('entregado').length;
    
    // Obtener órdenes activas (todas excepto entregadas)
    const ordenesActivas = allOrders.filter(o => o.estado !== 'entregado');
    
    res.render('proveedor/dashboard', {
        title: 'SGEE - Panel de Proveedor',
        user: req.session.user,
        orders: ordenesActivas,
        stats: {
            pendientes: pendientes,
            enPreparacion: enPreparacion,
            enEnvio: enEnvio,
            entregados: entregados,
            totalActivas: ordenesActivas.length
        }
    });
};

export const updateOrderStatus = (req, res) => {
    if (!req.session.user || !req.session.user.authenticated || req.session.user.userType !== 'proveedor') {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    const { orderId, nuevoEstado } = req.body;
    
    if (!orderId || !nuevoEstado) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }
    
    const order = dataModel.updateOrderStatus(orderId, nuevoEstado);
    
    if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    // Recalcular estadísticas
    const pendientes = dataModel.getOrdersByStatus('pendiente').length;
    const enPreparacion = dataModel.getOrdersByStatus('en_preparacion').length;
    const enEnvio = dataModel.getOrdersByStatus('en_envio').length;
    const entregados = dataModel.getOrdersByStatus('entregado').length;
    
    res.json({
        success: true,
        message: 'Estado de orden actualizado',
        stats: {
            pendientes: pendientes,
            enPreparacion: enPreparacion,
            enEnvio: enEnvio,
            entregados: entregados
        }
    });
};
