// Modelo de datos compartido (simula una base de datos en memoria)
// En producción, esto se conectaría a una base de datos real

// Lista de productos (compartida entre admin y cliente)
let products = [
    {
        id: 1,
        nombre: 'Laptop Pro 15',
        descripcion: 'Potente laptop para profesionales con procesador de última generación',
        precio: 2500000,
        categoria: 'Electrónica',
        imagen: null,
        icon: 'fas fa-laptop'
    },
    {
        id: 2,
        nombre: 'Auriculares Bluetooth',
        descripcion: 'Auriculares inalámbricos con cancelación de ruido',
        precio: 500000,
        categoria: 'Audio',
        imagen: null,
        icon: 'fas fa-headphones'
    },
    {
        id: 3,
        nombre: 'Smartwatch Fitness',
        descripcion: 'Reloj inteligente con monitor de salud y fitness',
        precio: 1150000,
        categoria: 'Wearables',
        imagen: null,
        icon: 'fas fa-clock'
    },
    {
        id: 4,
        nombre: 'Teclado Mecánico RGB',
        descripcion: 'Teclado gaming con switches mecánicos e iluminación RGB',
        precio: 800000,
        categoria: 'Periféricos',
        imagen: null,
        icon: 'fas fa-keyboard'
    },
    {
        id: 5,
        nombre: 'Mouse Inalámbrico',
        descripcion: 'Mouse ergonómico de alta precisión',
        precio: 10000,
        categoria: 'Periféricos',
        imagen: null,
        icon: 'fas fa-mouse'
    },
    {
        id: 6,
        nombre: 'Monitor 4K 27"',
        descripcion: 'Monitor ultra HD con colores vibrantes y alta tasa de refresco',
        precio: 2500000,
        categoria: 'Monitores',
        imagen: null,
        icon: 'fas fa-tv'
    }
];

// Lista de órdenes (compartida entre cliente y proveedor)
let orders = [];

// Lista de categorías
let categories = [
    {
        id: 1,
        nombre: 'Electrónica',
        descripcion: 'Dispositivos electrónicos y tecnológicos',
        icon: 'fas fa-microchip',
        activa: true
    },
    {
        id: 2,
        nombre: 'Audio',
        descripcion: 'Equipos de audio y sonido',
        icon: 'fas fa-headphones',
        activa: true
    },
    {
        id: 3,
        nombre: 'Wearables',
        descripcion: 'Dispositivos portátiles y wearables',
        icon: 'fas fa-clock',
        activa: true
    },
    {
        id: 4,
        nombre: 'Periféricos',
        descripcion: 'Periféricos de computadora',
        icon: 'fas fa-keyboard',
        activa: true
    },
    {
        id: 5,
        nombre: 'Monitores',
        descripcion: 'Monitores y pantallas',
        icon: 'fas fa-tv',
        activa: true
    },
    {
        id: 6,
        nombre: 'Otros',
        descripcion: 'Otras categorías',
        icon: 'fas fa-box',
        activa: true
    }
];

// Funciones para productos
export const getAllProducts = () => {
    return products;
};

export const getProductById = (id) => {
    return products.find(p => p.id === id);
};

export const addProduct = (product) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
        ...product,
        id: newId
    };
    products.push(newProduct);
    return newProduct;
};

export const updateProduct = (id, productData) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = {
            ...products[index],
            ...productData
        };
        return products[index];
    }
    return null;
};

export const deleteProduct = (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        return true;
    }
    return false;
};

// Funciones para órdenes
export const getAllOrders = () => {
    return orders;
};

export const getOrderById = (id) => {
    return orders.find(o => o.id === id);
};

export const createOrder = (orderData) => {
    const newId = 'ORD-' + Date.now();
    const newOrder = {
        id: newId,
        ...orderData,
        estado: 'pendiente',
        fechaCreacion: new Date().toLocaleString('es-CO'),
        fechaActualizacion: new Date().toLocaleString('es-CO')
    };
    orders.push(newOrder);
    return newOrder;
};

export const updateOrderStatus = (id, nuevoEstado) => {
    const order = orders.find(o => o.id === id);
    if (order) {
        order.estado = nuevoEstado;
        order.fechaActualizacion = new Date().toLocaleString('es-CO');
        return order;
    }
    return null;
};

export const getOrdersByStatus = (estado) => {
    return orders.filter(o => o.estado === estado);
};

// Funciones para categorías
export const getAllCategories = () => {
    return categories.filter(c => c.activa !== false);
};

export const getCategoryById = (id) => {
    return categories.find(c => c.id === id);
};

export const getCategoryByName = (nombre) => {
    return categories.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
};

export const addCategory = (category) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const newCategory = {
        ...category,
        id: newId,
        activa: category.activa !== undefined ? category.activa : true
    };
    categories.push(newCategory);
    return newCategory;
};

export const updateCategory = (id, categoryData) => {
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
        categories[index] = {
            ...categories[index],
            ...categoryData
        };
        return categories[index];
    }
    return null;
};

export const deleteCategory = (id) => {
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
        // Verificar si hay productos usando esta categoría
        const productosConCategoria = products.filter(p => p.categoria === categories[index].nombre);
        if (productosConCategoria.length > 0) {
            // No eliminar, solo desactivar
            categories[index].activa = false;
            return { deleted: false, message: 'Categoría desactivada porque tiene productos asociados' };
        }
        categories.splice(index, 1);
        return { deleted: true, message: 'Categoría eliminada' };
    }
    return null;
};

