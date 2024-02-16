const mongoose = require('mongoose');
const { CastError } = require('mongoose').Error;
const Cart = require('../models/carts-mongoose'); 
const Product = require('../models/products-mongoose'); 

class CartManager {
    constructor() {}

    // Crear un nuevo carrito
    async createCart() {
        try {
            const cart = new Cart();
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error creando el carrito:', error);
            throw error;
        }
    }

    // Añadir producto al carrito por IDs
    async addToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                console.log('Carrito no encontrado');
                return { success: false, message: 'Carrito no encontrado', cart: null };
            }
    
            const product = await Product.findById(productId);
            if (!product) {
                console.log('Producto no encontrado');
                return { success: false, message: 'Producto no encontrado', cart: null };
            }
    
            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(item => item.productId.equals(productId));
    
            if (existingProductIndex >= 0) {
                // Si el producto ya existe, actualiza su cantidad
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Si es un nuevo producto, lo añade al carrito
                cart.products.push({ productId, quantity });
            }
    
            await cart.save(); // Guarda los cambios en el carrito
    
            return { success: true, message: 'Producto agregado al carrito correctamente', cart: cart };
        } catch (error) {
            if (error instanceof CastError) {
                console.error('ID incorrecto:', error);
                return { success: false, message: 'ID incorrecto de carrito o producto', cart: null };
            } else {
                console.error('Error añadiendo producto al carrito:', error);
                throw error;
            }
        }
    }
       
    
    async getAllCarts() {
        try {
            const carts = await Cart.find(); // Encuentra todos los carritos en la base de datos
            return carts;
        } catch (error) {
            console.error('Error obteniendo todos los carritos:', error);
            throw error;
        }
    }    

    // Obtener el carrito y sus productos
    async getCart(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.productId');
            if (!cart) {
                console.log('Carrito no encontrado');
                return null; // Devuelve null para indicar que no se encontró el carrito
            }
            return cart;
        } catch (error) {
            if (error instanceof CastError && error.path === '_id') {
                console.error('ID incorrecto de carrito:', error);
                return null; // Devuelve null para indicar un error de CastError específicamente con el _id
            } else {
                console.error('Error obteniendo el carrito:', error);
                throw error; // Mantener el throw aquí para errores reales de servidor/base de datos
            }
        }
    }
       

    // Eliminar un carrito por ID
    async deleteCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                console.log('Carrito no encontrado');
                return false; // Devuelve false indicando que el carrito no se encontró
            }
            
            await cart.deleteOne(); // Utiliza deleteOne() para eliminar el documento
            return true; // Devuelve true indicando que el carrito se eliminó correctamente
        } catch (error) {
            if (error instanceof CastError) {
                console.error('ID incorrecto:', error);
                return false; // Devuelve false indicando que el ID es incorrecto
            } else {
                console.error('Error eliminando el carrito:', error);
                throw error;
            }
        }
    }     

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                console.log('Carrito no encontrado');
                return { success: false, message: 'Carrito no encontrado' };
            }
    
            // Encuentra el índice del producto en el carrito
            const productIndex = cart.products.findIndex(product => product.productId.equals(productId));
    
            if (productIndex !== -1) {
                // Si se encuentra el producto, reduce la cantidad en 1 o elimina completamente el producto del carrito
                if (cart.products[productIndex].quantity > 1) {
                    cart.products[productIndex].quantity -= 1;
                } else {
                    cart.products.splice(productIndex, 1);
                }
    
                await cart.save(); // Guarda los cambios en el carrito
    
                return {
                    success: true,
                    message: 'Producto eliminado del carrito correctamente',
                    cart: cart
                };
            } else {
                // Si no se encuentra el producto en el carrito, devuelve un mensaje indicando que no se encontró
                return {
                    success: false,
                    message: 'Producto no encontrado en el carrito',
                    cart: cart
                };
            }
        } catch (error) {
            if (error instanceof CastError) {
                console.error('ID incorrecto:', error);
                return { success: false, message: 'Carrito no encontrado' };
            } else {
                console.error('Error eliminando el producto del carrito:', error);
                throw error;
            }
        }
    }
    
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getCart(cartId); // Asegúrate de tener una función getCart que retorne el carrito
        if (!cart) {
            return { success: false, message: "Carrito no encontrado" };
        }
    
        const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
        if (productIndex === -1) {
            return { success: false, message: "Producto no encontrado en el carrito" };
        }
    
        // Si la cantidad es 0 o menor, considerar eliminar el producto del carrito
        if (quantity <= 0) {
            cart.products.splice(productIndex, 1); // Elimina el producto
        } else {
            cart.products[productIndex].quantity = quantity; // Actualiza la cantidad
        }
    
        await cart.save();
        return { success: true, cart: cart };
    }
    
    async updateCartProducts(cartId, products) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                return { success: false, message: "Carrito no encontrado" };
            }
    
            // Asegúrate de crear nuevos ObjectId para los productId
            const updatedProducts = products.map(product => ({
                productId: new mongoose.Types.ObjectId(product.productId),
                quantity: Number(product.quantity)
            }));
    
            cart.products = updatedProducts;c
    
            await cart.save();
            return { success: true, cart: cart };
        } catch (error) {
            console.error("Error al actualizar el carrito con nuevos productos", error);
            throw error;
        }
    }    
          
}

module.exports = CartManager;