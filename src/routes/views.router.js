const express = require("express");
const router = express.Router();

const ProductManagerFs = require("../dao/fs/productManager-fs")
const productManagerFs = new ProductManagerFs("../dao/fs/products.json");

const ProductManager = require("../dao/db/productManager");
const productManager = new ProductManager();

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

module.exports = router;