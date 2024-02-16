const express = require("express");
const router = express.Router();

const ProductManagerFs = require("../dao/fs/productManager-fs")
const productManagerFs = new ProductManagerFs("../dao/fs/products.json");

const ProductManager = require("../dao/db/productManager");
const productManager = new ProductManager();

const CartManager = require("../dao/db/cartManager.js");
const cartManager = new CartManager();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/products", async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;

        const options = {
            limit: limit ? parseInt(limit, 10) : 10,
            page: page ? parseInt(page, 10) : 1,
            sort: sort || '',
            query: query || ''
        };

        const result = await productManager.getProducts(options);
        
        // Asumiendo que 'getProducts' devuelve un objeto con la estructura esperada
        const productosObj = Array.isArray(result.products) ? result.products.map(producto => {
            return producto.toObject ? producto.toObject() : producto;
        }) : [];

        res.render("products", {
            productos: productosObj,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: options.limit, // Se asegura de pasar el límite actual
            sort: options.sort, // Pasa el parámetro 'sort' actual a la plantilla
            query: options.query, // Pasa el parámetro 'query' actual si lo estás utilizando
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get("/carts", async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        // Convertir cada documento de carrito a un objeto plano, si es necesario.
        const cartsObjects = carts.map(cart => cart.toObject ? cart.toObject() : cart);
        // Renderiza una vista llamada 'cartsList' y pasa los datos de los carritos convertidos.
        res.render('carts', { carts: cartsObjects });
    } catch (error) {
        console.error("Error al obtener todos los carritos...", error);
        // Renderiza una vista de error o maneja el error como prefieras.
        res.status(404).render('error', { message: "Error al intentar listar los carritos" });
    }
});



router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCart(req.params.cid);
        if (cart) {
            // Convertir el documento Mongoose a un objeto si es necesario
            const cartObject = cart.toObject ? cart.toObject() : cart;
            res.render('cart', { cart: cartObject });
        } else {
            // Si no se encuentra el carrito, renderiza la vista de error con estado 404
            res.status(404).render('error', { message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el carrito por ID...", error);
        // Renderiza la vista de error con estado 404 para cualquier error
        res.status(404).render('error', { message: "Carrito no encontrado" });
    }
});

module.exports = router;