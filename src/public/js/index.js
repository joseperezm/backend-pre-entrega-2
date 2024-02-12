const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
}); 

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";


    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
                <img src="${item.thumbnails}" class="card-img-top" alt="${item.title}">
                <p>Id ${item._id} </p>
                <p>Titulo ${item.title} </p>
                <p>Precio ${item.price} </p>
                <button type="button" class="btn btn-primary mt-2"> Eliminar Producto </button>
        
        `;
        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item._id);
        });
    });
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const thumbnails = document.getElementById("thumbnails").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const status = document.getElementById("status").value === "true";

    // Función para verificar si es una URL válida
    const esURL = (texto) => {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(texto);
    }

    // Función para agregar el prefijo 'uploads/' si no es una URL válida
    const ajustarThumbnail = (thumbnail) => {
        if (esURL(thumbnail)) {
            return thumbnail;
        } else {
            return `uploads/${thumbnail}`;
        }
    };

    // Validación de campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
        alert("Por favor, complete todos los campos obligatorios: título, descripción, código, precio, stock y categoría.");
        return;
    }

    const producto = {
        title: title,
        description: description,
        price: parseFloat(price),
        thumbnails: ajustarThumbnail(thumbnails), // Aplicar la función de ajuste al thumbnail
        code: code,
        stock: parseInt(stock),
        category: category,
        status: status
    };
    
    socket.emit("agregarProducto", producto);
};