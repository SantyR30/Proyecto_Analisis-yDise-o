// JavaScript del frontend - Solo maneja eventos, sin lógica de negocio

document.addEventListener('DOMContentLoaded', function() {
    // Manejar menú de categorías
    const menuToggle = document.querySelector('.menu-toggle');
    const categoriesDropdown = document.getElementById('categories-dropdown');
    
    if (menuToggle && categoriesDropdown) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = categoriesDropdown.style.maxHeight && categoriesDropdown.style.maxHeight !== '0px';
            if (isOpen) {
                categoriesDropdown.style.maxHeight = '0px';
                categoriesDropdown.style.padding = '0';
            } else {
                categoriesDropdown.style.maxHeight = '500px';
                categoriesDropdown.style.padding = '10px 0';
            }
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!categoriesDropdown.contains(e.target) && !menuToggle.contains(e.target)) {
                categoriesDropdown.style.maxHeight = '0px';
                categoriesDropdown.style.padding = '0';
            }
        });
    }
    
    // Agregar productos al carrito
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.getAttribute('data-product-id');
            const productTitle = this.getAttribute('data-product-title');
            const productPrice = this.getAttribute('data-product-price');
            const productDescription = this.getAttribute('data-product-description');
            const productIcon = this.getAttribute('data-product-icon');
            
            // Llamar al endpoint del servidor
            fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    title: productTitle,
                    price: productPrice,
                    description: productDescription,
                    icon: productIcon
                })
            })
            .then(response => {
                if (response.status === 401) {
                    // No autenticado, redirigir a login
                    window.location.href = '/login';
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                
                if (data.success) {
                    // Animar el icono del carrito
                    animateCartIcon();
                    // Actualizar badge
                    updateCartBadge(data.cartCount);
                    // Redirigir a confirmación
                    setTimeout(() => {
                        window.location.href = '/confirmacion';
                    }, 500);
                } else {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    } else {
                        alert('Error al agregar producto: ' + (data.error || 'Error desconocido'));
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al agregar producto al carrito');
            });
        });
    });

    // Control de cantidad en el carrito
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemIndex = parseInt(this.getAttribute('data-item-index'));
            const quantitySpan = this.parentElement.querySelector(`.quantity[data-item-index="${itemIndex}"]`);
            let quantity = parseInt(quantitySpan.textContent);
            
            if (this.classList.contains('plus')) {
                quantity++;
            } else if (this.classList.contains('minus') && quantity > 1) {
                quantity--;
            }
            
            // Actualizar en el servidor
            updateCartItem(itemIndex, quantity);
        });
    });

    // Eliminar item del carrito
    const deleteButtons = document.querySelectorAll('.delete-item');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
                const itemIndex = parseInt(this.getAttribute('data-item-index'));
                removeCartItem(itemIndex);
            }
        });
    });

    // Búsqueda
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Buscando:', this.value);
                // Aquí se puede agregar lógica de búsqueda
            }
        });
    }
});

// Función para animar el icono del carrito
function animateCartIcon() {
    const cartIconContainer = document.getElementById('cart-icon-link');
    if (cartIconContainer) {
        cartIconContainer.classList.add('cart-animate');
        setTimeout(() => {
            cartIconContainer.classList.remove('cart-animate');
        }, 500);
    }
}

// Función para actualizar el badge del carrito
function updateCartBadge(count) {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = count;
        if (count > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Función para actualizar un item del carrito
function updateCartItem(itemIndex, quantity) {
    fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            itemIndex: itemIndex,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Actualizar cantidad en el DOM
            const quantitySpan = document.querySelector(`.quantity[data-item-index="${itemIndex}"]`);
            if (quantitySpan) {
                quantitySpan.textContent = quantity;
            }
            
            // Actualizar precio total del item
            const cartItem = document.querySelector(`.cart-item[data-item-index="${itemIndex}"]`);
            if (cartItem) {
                const priceElement = cartItem.querySelector(`.cart-item-price[data-item-index="${itemIndex}"]`);
                const unitPrice = parseFloat(priceElement ? priceElement.getAttribute('data-item-price') : 0);
                if (priceElement && unitPrice) {
                    const totalPrice = unitPrice * quantity;
                    priceElement.textContent = `$ ${new Intl.NumberFormat('es-CO').format(totalPrice)}`;
                }
            }
            
            // Actualizar resumen
            updateOrderSummary(data);
            updateCartBadge(data.cartCount);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el carrito');
    });
}

// Función para eliminar un item del carrito
function removeCartItem(itemIndex) {
    fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            itemIndex: itemIndex
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.empty) {
                window.location.href = data.redirect || '/carrito-vacio';
            } else {
                // Recargar la página para actualizar el carrito
                window.location.reload();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
    });
}

// Función para actualizar el resumen de la orden
function updateOrderSummary(data) {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement && data.subtotal !== undefined) {
        subtotalElement.textContent = `$ ${new Intl.NumberFormat('es-CO').format(data.subtotal)}`;
    }
    if (totalElement && data.total !== undefined) {
        totalElement.textContent = `$ ${new Intl.NumberFormat('es-CO').format(data.total)}`;
    }
}

// Funciones para el modal de agregar producto
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Funciones para el modal de agregar categoría
function openAddCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeAddCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const addProductModal = document.getElementById('addProductModal');
    const addCategoryModal = document.getElementById('addCategoryModal');
    if (event.target === addProductModal) {
        addProductModal.style.display = 'none';
    }
    if (event.target === addCategoryModal) {
        addCategoryModal.style.display = 'none';
    }
}

// Manejar el formulario de agregar producto (el formulario se envía normalmente, solo cerramos el modal)
document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        // El formulario se envía normalmente, no necesitamos prevenir el submit
        // Solo cerramos el modal si hay algún error
    }
    
    // Manejar formulario de finalizar compra
    const finalizeOrderForm = document.getElementById('finalize-order-form');
    if (finalizeOrderForm) {
        finalizeOrderForm.addEventListener('submit', function(e) {
            const shippingAddressInput = document.getElementById('shipping-address');
            const shippingAddressValue = document.getElementById('shipping-address-value');
            if (shippingAddressInput && shippingAddressValue) {
                shippingAddressValue.value = shippingAddressInput.value;
            }
        });
    }
    
    // Manejar actualización de estado de órdenes (Panel de Proveedor)
    const orderActionButtons = document.querySelectorAll('.btn-order-action');
    orderActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            const nextStatus = this.getAttribute('data-next-status');
            
            if (!orderId || !nextStatus) {
                return;
            }
            
            // Confirmar acción
            const statusNames = {
                'en_preparacion': 'En Preparación',
                'en_envio': 'En Envío',
                'entregado': 'Entregado'
            };
            
            if (confirm('¿Estás seguro de marcar esta orden como "' + (statusNames[nextStatus] || nextStatus) + '"?')) {
                updateOrderStatus(orderId, nextStatus);
            }
        });
    });
});

// Función para actualizar el estado de una orden
function updateOrderStatus(orderId, nuevoEstado) {
    fetch('/proveedor/ordenes/actualizar-estado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderId: orderId,
            nuevoEstado: nuevoEstado
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Actualizar estadísticas
            if (data.stats) {
                const statPendientes = document.getElementById('stat-pendientes');
                const statEnPreparacion = document.getElementById('stat-en-preparacion');
                const statEnEnvio = document.getElementById('stat-en-envio');
                const statEntregados = document.getElementById('stat-entregados');
                
                if (statPendientes) statPendientes.textContent = data.stats.pendientes || 0;
                if (statEnPreparacion) statEnPreparacion.textContent = data.stats.enPreparacion || 0;
                if (statEnEnvio) statEnEnvio.textContent = data.stats.enEnvio || 0;
                if (statEntregados) statEntregados.textContent = data.stats.entregados || 0;
            }
            
            // Recargar la página para actualizar la vista completa
            window.location.reload();
        } else {
            alert('Error al actualizar el estado de la orden: ' + (data.error || 'Error desconocido'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el estado de la orden');
    });
}
