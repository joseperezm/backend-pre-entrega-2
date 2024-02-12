const mongoose = require('mongoose');
const { CastError } = require('mongoose').Error;
const Product = require('../models/products-mongoose'); 

class ProductManager {
    constructor() {}

    // Añadir un nuevo producto
    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            console.error('Error añadiendo el producto:', error);
            throw error;
        }
    }

    // Obtener todos los productos
    async getProducts() {
        try {
            return await Product.find({});
        } catch (error) {
            console.error('Error obteniendo los productos:', error);
            throw error;
        }
    }

    // Obtener un producto por ID
    async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            if (error instanceof CastError && error.path === '_id') {
                console.error('ID incorrecto de producto:', error);
                return null;
            } else {
                console.error('Error obteniendo el producto por ID:', error);
                throw error;
            }
        }
    }

    // Actualizar un producto por ID
    async updateProduct(productId, productData) {
        try {
            return await Product.findByIdAndUpdate(productId, productData, { new: true });
        } catch (error) {
            if (error instanceof CastError && error.path === '_id') {
                console.error('ID incorrecto de producto:', error);
                return null;
            } else {
                console.error('Error actualizando el producto:', error);
                throw error;
            }
        }
    }

    // Eliminar un producto por ID
    async deleteProduct(productId) {
        try {
            return await Product.findByIdAndDelete(productId);
        } catch (error) {
            if (error instanceof CastError && error.path === '_id') {
                console.error('ID incorrecto de producto:', error);
                return null;
            } else {
                console.error('Error eliminando el producto:', error);
                throw error;
            }
        }
    }  
}

module.exports = ProductManager;