const express = require('express');
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const mongoose = require('mongoose');
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

const app = express();

mongoose.connect('mongodb+srv://coderhouse:ihOXSjjIqf0DM7xT@jjpm.envjeyh.mongodb.net/ecommerce?retryWrites=true&w=majority')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));
  
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static("./src/public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

const ProductManagerFs = require("./dao/fs/productManager-fs")
const productManagerFs = new ProductManagerFs("./dao/fs/products.json");

const ProductManager = require("./dao/db/productManager.js");
const productManager = new ProductManager();

const io = socket(server);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    socket.emit("productos", await productManager.getProducts());    
    
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("productos", await productManager.getProducts());
    });

    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        io.sockets.emit("productos", await productManager.getProducts());
    });
});

const Message = require('./dao/models/messages-mongoose.js'); 

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

   // Espera a recibir el correo electrónico del usuario
   socket.on('user email provided', (email) => {
    console.log(`Correo electrónico recibido: ${email}`);
    // Aquí puedes agregar lógica adicional basada en el correo electrónico, si es necesario
    
    // Después de recibir el correo electrónico, envía todos los mensajes
    Message.find().then(messages => {
        socket.emit('load all messages', messages); 
    });
});

    socket.on('chat message', async (data) => {
        try {
            const message = new Message(data);
            await message.save();
            io.emit('chat message', data); 
        } catch (error) {
            console.error('Error guardando el mensaje', error);
        }
    });
});