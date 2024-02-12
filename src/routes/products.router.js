const express = require("express");
const router = express.Router();

const ProductManagerFs = require("../dao/fs/productManager-fs")
const productManagerFs = new ProductManagerFs("../dao/fs/products.json");

const ProductManager = require("../dao/db/productManager");
const productManager = new ProductManager();

router.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit; 
        let products;

        if (limit) {
            products = await productManager.getProducts();
            products = products.slice(0, parseInt(limit));
        } else {
            products = await productManager.getProducts();
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado o inexistente' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const newProduct = req.body;
        const product = await productManager.addProduct(newProduct);
        res.status(201).json({ id: product._id, message: 'Producto agregado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.id, req.body);

        if (updatedProduct) {
            res.json({ message: 'Producto actualizado correctamente', product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Producto no encontrado o inexistente' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/products/:pid', async (req, res) => {
    try {
        const success = await productManager.deleteProduct(req.params.pid);
        
        if (success) {
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'El producto que desea eliminar no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;