// Controlador de perfil

export const renderProfile = (req, res) => {
    // Verificar autenticación
    if (!req.session.user || !req.session.user.authenticated) {
        return res.redirect('/login');
    }
    
    res.render('perfil', {
        title: 'SGEE - Mi Perfil',
        user: req.session.user
    });
};

export const updateProfile = (req, res) => {
    // Verificar autenticación
    if (!req.session.user || !req.session.user.authenticated) {
        return res.redirect('/login');
    }
    
    const { nombre, apellidos, email } = req.body;
    
    // Actualizar datos del usuario en la sesión
    if (nombre) req.session.user.nombre = nombre;
    if (apellidos) req.session.user.apellidos = apellidos;
    if (email) req.session.user.email = email;
    
    // En producción, aquí se actualizaría en la base de datos
    
    res.redirect('/perfil');
};

