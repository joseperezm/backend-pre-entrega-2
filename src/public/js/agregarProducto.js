document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');

            // Hacer fetch para obtener todos los carritos disponibles
            fetch('/api/carts')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudo obtener la lista de carritos');
                    }
                    return response.json();
                })
                .then(data => {
                    // Suponiendo que la respuesta es un arreglo de objetos de carritos y cada uno tiene un _id
                    const cartIds = data.map(cart => cart._id);
                    let cartList = cartIds.join(", ");
                    const cartId = prompt(`Ingrese el ID del carrito al que desea añadir el producto:\nDisponibles: ${cartList}`);
                    
                    if (cartId && cartIds.includes(cartId)) {
                        const quantityInput = document.getElementById(`quantity-${productId}`);
                        const quantity = quantityInput ? quantityInput.value : 1; // Usa el valor del selector de cantidad o 1 por defecto
                        
                        // Aquí la lógica para agregar el producto al carrito especificado
                        fetch(`/api/carts/${cartId}/product/${productId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ quantity: quantity }) // Enviar la cantidad seleccionada
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message); // Muestra un mensaje con el resultado de la operación
                        })
                        .catch(error => console.error('Error:', error));
                    } else {
                        alert("ID de carrito no válido o no disponible.");
                    }
                })
                .catch(error => {
                    console.error('Error al obtener carritos:', error);
                });
        });
    });
});