const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { CastError } = require('mongoose').Error;
const Product = require('../models/products-mongoose'); 

Product.schema.plugin(mongoosePaginate);

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
    async getProducts({ limit, page = 1, sort = '', query = '' } = {}) {
        try {
            let queryFilter = {};
            if (query) {
                // Búsqueda general por título o descripción
                queryFilter.$or = [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ];
            }
    
            let sortOptions = {};
            if (sort === 'asc' || sort === 'desc') {
                sortOptions.price = sort === 'asc' ? 1 : -1;
            }
    
            if (limit !== undefined) {
                // Convertir limit a número si se ha proporcionado
                limit = parseInt(limit);
            }
    
            const options = {
                page: page,
                limit: limit, // Puede ser undefined si queremos todos los productos
                sort: sortOptions,
            };
    
            if (limit === undefined) {
                // Si no se especifica limit, buscar todos los documentos sin paginación
                const docs = await Product.find(queryFilter).sort(sortOptions);
                return {
                    products: docs,
                    totalPages: 1,
                    page: 1,
                    hasPrevPage: false,
                    hasNextPage: false,
                    prevPage: null,
                    nextPage: null,
                };
            } else {
                // Usar mongoose-paginate-v2 para la paginación
                const result = await Product.paginate(queryFilter, options);
                return {
                    products: result.docs,
                    totalPages: result.totalPages,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                };
            }
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