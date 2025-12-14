// Controlador de autenticación

export const renderLogin = (req, res) => {
    res.render('login', { 
        title: 'SGEE - Iniciar Sesión',
        error: null 
    });
};

export const renderRegister = (req, res) => {
    res.render('registro', { 
        title: 'SGEE - Registrarse',
        error: null 
    });
};

export const login = (req, res) => {
    const { email, password, userType } = req.body;
    
    // Validación básica
    if (!email || !password || !userType) {
        return res.render('login', {
            title: 'SGEE - Iniciar Sesión',
            error: 'Todos los campos son requeridos'
        });
    }
    
    // En producción, aquí se validaría contra la base de datos
    // Por ahora, simulamos autenticación exitosa
    req.session.user = {
        email: email,
        userType: userType, // 'cliente', 'proveedor', 'administrador'
        authenticated: true
    };
    
    // Redirigir según el tipo de usuario
    if (userType === 'administrador') {
        return res.redirect('/admin/dashboard');
    } else if (userType === 'proveedor') {
        return res.redirect('/proveedor/dashboard');
    } else {
        return res.redirect('/');
    }
};

export const register = (req, res) => {
    const { nombre, apellidos, email, password, confirmPassword } = req.body;
    
    // Validación básica
    if (!nombre || !apellidos || !email || !password || !confirmPassword) {
        return res.render('registro', {
            title: 'SGEE - Registrarse',
            error: 'Todos los campos son requeridos'
        });
    }
    
    if (password !== confirmPassword) {
        return res.render('registro', {
            title: 'SGEE - Registrarse',
            error: 'Las contraseñas no coinciden'
        });
    }
    
    // En producción, aquí se guardaría en la base de datos
    // Por ahora, simulamos registro exitoso
    req.session.user = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        userType: 'cliente',
        authenticated: true
    };
    
    return res.redirect('/');
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        // Redirigir siempre al home
        res.redirect('/');
    });
};

