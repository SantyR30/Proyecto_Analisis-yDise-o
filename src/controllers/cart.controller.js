// Controlador del carrito

import * as dataModel from '../models/data.model.js';

export const renderCart = (req, res) => {
    // Verificar autenticación
    if (!req.session.user || !req.session.user.authenticated) {
        return res.redirect('/login');
    }
    
    // Obtener carrito de la sesión (en producción sería de la BD)
    const cart = req.session.cart || [];
    
    // Si el carrito está vacío, redirigir a la vista de carrito vacío
    if (!cart || cart.length === 0) {
        return res.redirect('/carrito-vacio');
    }
    
    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 2000;
    const total = subtotal + shipping;
    
    res.render('carrito', {
        title: 'SGEE - Carrito de Compras',
        cart: cart,
        subtotal: subtotal,
        shipping: shipping,
        total: total
    });
};

export const renderEmptyCart = (req, res) => {
    res.render('carrito-vacio', {
        title: 'SGEE - Carrito Vacío'
    });
};

export const addToCart = (req, res) => {
    const { productId, title, price, description, icon } = req.body;
    
    // Verificar autenticación
    if (!req.session.user || !req.session.user.authenticated) {
        return res.status(401).json({ 
            success: false,
            error: 'Debes iniciar sesión para agregar productos',
            redirect: '/login'
        });
    }
    
    // Inicializar carrito si no existe
    if (!req.session.cart) {
        req.session.cart = [];
    }
    
    // Buscar si el producto ya está en el carrito
    const existingItem = req.session.cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        req.session.cart.push({
            productId: productId,
            title: title,
            price: parseFloat(price),
            description: description,
            icon: icon,
            quantity: 1
        });
    }
    
    res.json({ 
        success: true, 
        message: 'Producto agregado al carrito',
        cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0)
    });
};

export const updateCartItem = (req, res) => {
    const { itemIndex, quantity } = req.body;
    
    if (!req.session.cart || !req.session.cart[itemIndex]) {
        return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    if (quantity < 1) {
        return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }
    
    req.session.cart[itemIndex].quantity = parseInt(quantity);
    
    const subtotal = req.session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 2000;
    const total = subtotal + shipping;
    
    res.json({
        success: true,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0)
    });
};

export const removeFromCart = (req, res) => {
    const { itemIndex } = req.body;
    
    if (!req.session.cart || !req.session.cart[itemIndex]) {
        return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    req.session.cart.splice(itemIndex, 1);
    
    if (req.session.cart.length === 0) {
        return res.json({ 
            success: true, 
            empty: true,
            redirect: '/carrito-vacio'
        });
    }
    
    res.json({ 
        success: true,
        cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0)
    });
};

export const finalizeOrder = (req, res) => {
    // Verificar autenticación
    if (!req.session.user || !req.session.user.authenticated) {
        return res.redirect('/login');
    }
    
    const cart = req.session.cart || [];
    const { shippingAddress } = req.body;
    
    if (!cart || cart.length === 0) {
        return res.redirect('/carrito-vacio');
    }
    
    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 2000;
    const total = subtotal + shipping;
    
    // Crear orden usando el modelo compartido
    const order = dataModel.createOrder({
        cliente: req.session.user.nombre || req.session.user.email || 'Cliente Usuario',
        email: req.session.user.email || 'customer@tienda.com',
        productos: cart.map(item => `${item.quantity}x ${item.title}`).join(', '),
        productosDetalle: cart, // Guardar el detalle completo de productos
        direccion: shippingAddress || 'No especificada',
        total: total,
        subtotal: subtotal,
        envio: shipping
    });
    
    // Vaciar el carrito después de crear la orden
    req.session.cart = [];
    
    // Redirigir a confirmación
    res.redirect('/confirmacion');
};

export const renderConfirmation = (req, res) => {
    // Verificar autenticación
    if (!req.session.user || !req.session.user.authenticated) {
        return res.redirect('/login');
    }
    
    res.render('confirmacion', {
        title: 'SGEE - Orden Confirmada'
    });
};
