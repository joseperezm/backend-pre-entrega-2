document.addEventListener("DOMContentLoaded", function() {
    const deleteButtons = document.querySelectorAll('.delete-product-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cartId = this.getAttribute('data-cart-id');
            const productId = this.getAttribute('data-product-id');

            fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Aquí podrías recargar la página o eliminar el elemento del DOM para reflejar el cambio
                window.location.reload(); // Recargar la página para ver los cambios
            })
            .catch(error => console.error('Error:', error));
        });
    });
});