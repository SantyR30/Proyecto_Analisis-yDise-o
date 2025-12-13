// Funcionalidad básica de navegación y interactividad

document.addEventListener('DOMContentLoaded', function() {
    // Agregar productos al carrito
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Aquí se puede agregar lógica para agregar al carrito
            alert('Producto agregado al carrito');
            // Redirigir al carrito
            // window.location.href = '/carrito';
        });
    });

    // Control de cantidad en el carrito
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantitySpan = this.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantitySpan.textContent);
            
            if (this.classList.contains('plus')) {
                quantity++;
            } else if (this.classList.contains('minus') && quantity > 1) {
                quantity--;
            }
            
            quantitySpan.textContent = quantity;
        });
    });

    // Eliminar item del carrito
    const deleteButtons = document.querySelectorAll('.delete-item');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
                this.closest('.cart-item').remove();
            }
        });
    });

    // Búsqueda
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Aquí se puede agregar lógica de búsqueda
                console.log('Buscando:', this.value);
            }
        });
    }
});


