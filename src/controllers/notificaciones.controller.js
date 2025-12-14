// Controlador de notificaciones

export const renderNotifications = (req, res) => {
    // Verificar autenticación
    if (!req.session.user || !req.session.user.authenticated) {
        return res.redirect('/login');
    }
    
    res.render('notificaciones', {
        title: 'SGEE - Notificaciones',
        user: req.session.user
    });
};

