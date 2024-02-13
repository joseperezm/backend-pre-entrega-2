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
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-title">Categoría: ${item.category}</p>
            <p class="card-text">Precio: $${item.price}</p>
            <p class="card-text">Stock: ${item.stock}</p>
            <p class="card-text">Status: ${item.status}</p>
            <p class="card-text">Code: ${item.code}</p>
            <p class="card-text mini mt-2 mb-2">ID: ${item._id}</p>
            <button type="button" class="btn btn-primary mt-2">Eliminar Producto</button>
        </div>
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

    const producto = {
        title: title,
        description: description,
        price: parseFloat(price),
        thumbnails: thumbnails || "uploads/placeholder.jpg", // Usar placeholder si no se proporciona thumbnail
        code: code,
        stock: parseInt(stock),
        category: category,
        status: status
    };
    
    // Validación de campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }
    
    socket.emit("agregarProducto", producto);
};



