# Cambios realizados:

## Modificaciones en el Método GET /

- **Objetivo**: Modificar el método `GET /` para soportar los siguientes parámetros opcionales:
  - `limit`: Número máximo de elementos a devolver.
    - Por defecto: 10.
  - `page`: Número de página a consultar.
    - Por defecto: 1.
  - `sort`: Ordenamiento `asc` (ascendente) o `desc` (descendente) por precio.
    - Sin ordenamiento por defecto.
  - `query`: Filtro de búsqueda específico.
    - Búsqueda general por defecto.

- **Respuesta esperada**: Objeto con formato:
  ```json
  {
    "status": "success/error",
    "payload": "Resultado de los productos solicitados",
    "totalPages": "Total de páginas",
    "prevPage": "Página anterior",
    "nextPage": "Página siguiente",
    "page": "Página actual",
    "hasPrevPage": "Indica si existe una página previa",
    "hasNextPage": "Indica si existe una página siguiente",
    "prevLink": "Link a la página previa (null si hasPrevPage=false)",
    "nextLink": "Link a la página siguiente (null si hasNextPage=false)"
  }
  ```

- **Búsqueda por categoría o disponibilidad**: Permitir filtrar productos por categoría o disponibilidad y ordenar los resultados por precio de manera ascendente o descendente.

## Nuevos Endpoints en Router de Carts

- `DELETE api/carts/:cid/products/:pid`: Elimina el producto seleccionado del carrito.
- `PUT api/carts/:cid`: Actualiza el carrito con un arreglo de productos.
- `PUT api/carts/:cid/products/:pid`: Actualiza la cantidad de un producto específico en el carrito.
- `DELETE api/carts/:cid`: Elimina todos los productos del carrito.
- **Nota**: Para el modelo de `Carts`, asegurarse de que el id de cada producto haga referencia al modelo de `Products` y utilizar "populate" para desglosar productos asociados.

## Vistas en Router de Views

- `/products`: Muestra todos los productos con paginación.
  - Opciones de visualización:
    1. Nueva vista con detalles completos del producto y opción de agregar al carrito.
    2. Botón de "agregar al carrito" directamente en la lista de productos.

- `/carts/:cid (cartId)`: Vista para visualizar un carrito específico, listando solo los productos que pertenecen a dicho carrito.

#
# Testeos

## Primera Pre-Entrega

### Recuerda reemplazar :id, :cid, y :pid con los identificadores apropiados cuando utilices estas URLs.

### URLs de Prueba para API de Productos

- [Listar todos los productos](http://localhost:8080/api/products) - `http://localhost:8080/api/products` - Método: `GET`.
- [Obtener un producto por ID](http://localhost:8080/api/products/:id) - `http://localhost:8080/api/products/:id` - Método: `GET`.
- [Agregar un nuevo producto](http://localhost:8080/api/products) - `http://localhost:8080/api/products` - Método: `POST`.
- [Actualizar un producto por ID](http://localhost:8080/api/products/:id) - `http://localhost:8080/api/products/:id` - Método: `PUT`.
- [Eliminar un producto por ID](http://localhost:8080/api/products/:id) - `http://localhost:8080/api/products/:id` - Método: `DELETE`.

### URLs de Prueba para API de Carritos

- [Crear un nuevo carrito](http://localhost:8080/api/carts) - `http://localhost:8080/api/carts` - Método: `POST`.
- [Listar productos en un carrito por ID de carrito](http://localhost:8080/api/carts/:cid) - `http://localhost:8080/api/carts/:cid` - Método: `GET`.
- [Agregar un producto a un carrito](http://localhost:8080/api/carts/:cid/product/:pid) - `http://localhost:8080/api/carts/:cid/product/:pid` - Método: `POST`.
- [Eliminar un producto de un carrito](http://localhost:8080/api/carts/:cid/product/:pid) - `http://localhost:8080/api/carts/:cid/product/:pid` - Método: `DELETE`.
- [Eliminar un carrito por ID](http://localhost:8080/api/carts/:cid) - `http://localhost:8080/api/carts/:cid` - Método: `DELETE`.

## Segunda Pre-Entrega

### URLs de Prueba para Web de Productos

- [Primera Página (default limit 10)](http://localhost:8080/?page=1) - `http://localhost:8080/?page=1`
- [Segunda Página (default limit 10)](http://localhost:8080/?page=2) - `http://localhost:8080/?page=2`
- [Limitar a 5 Productos](http://localhost:8080/?limit=5) - `http://localhost:8080/?limit=5`
- [Limitar a 20 Productos](http://localhost:8080/?limit=20) - `http://localhost:8080/?limit=20`
- [Orden Ascendente por Precio](http://localhost:8080/?sort=asc) - `http://localhost:8080/?sort=asc`
- [Orden Descendente por Precio](http://localhost:8080/?sort=desc) - `http://localhost:8080/?sort=desc`
- [Buscar "impresora" (Ejemplo de query)](http://localhost:8080/?query=impresora) - `http://localhost:8080/?query=impresora`
- [5 Productos, Primera Página, Orden Ascendente](http://localhost:8080/?limit=5&page=1&sort=asc) - `http://localhost:8080/?limit=5&page=1&sort=asc`
- [5 Productos, Segunda Página, Orden Descendente](http://localhost:8080/?limit=5&page=2&sort=desc) - `http://localhost:8080/?limit=5&page=2&sort=desc`
- [Buscar "teclado", Orden Ascendente](http://localhost:8080/?query=teclado&sort=asc) - `http://localhost:8080/?query=teclado&sort=asc`
- [Buscar "teclado", Orden Descendente](http://localhost:8080/?query=teclado&sort=desc) - `http://localhost:8080/?query=teclado&sort=desc`
- [Buscar por Categoría: Electrónicos](http://localhost:8080/?query=categoria:Electrónicos&limit=0) - `http://localhost:8080/?query=categoria:Electrónicos&limit=0`
- [Buscar Productos Disponibles](http://localhost:8080/?query=disponible:true&limit=25) - `http://localhost:8080/?query=disponible:true&limit=25`

### URLs de Prueba para API de Productos

- [Primera Página (default limit 10)](http://localhost:8080/api/products/?page=1) - `http://localhost:8080/api/products/?page=1` - Método: `GET`.
- [Segunda Página (default limit 10)](http://localhost:8080/api/products/?page=2) - `http://localhost:8080/api/products/?page=2` - Método: `GET`.
- [Limitar a 5 Productos](http://localhost:8080/api/products/?limit=5) - `http://localhost:8080/api/products/?limit=5` - Método: `GET`.
- [Limitar a 20 Productos](http://localhost:8080/api/products/?limit=20) - `http://localhost:8080/api/products/?limit=20` - Método: `GET`.
- [Orden Ascendente por Precio](http://localhost:8080/api/products/?sort=asc) - `http://localhost:8080/api/products/?sort=asc` - Método: `GET`.
- [Orden Descendente por Precio](http://localhost:8080/api/products/?sort=desc) - `http://localhost:8080/api/products/?sort=desc` - Método: `GET`.
- [Buscar "impresora" (Ejemplo de query)](http://localhost:8080/api/products/?query=impresora) - `http://localhost:8080/api/products/?query=impresora` - Método: `GET`.
- [5 Productos, Primera Página, Orden Ascendente](http://localhost:8080/api/products/?limit=5&page=1&sort=asc) - `http://localhost:8080/api/products/?limit=5&page=1&sort=asc` - Método: `GET`.
- [5 Productos, Segunda Página, Orden Descendente](http://localhost:8080/api/products/?limit=5&page=2&sort=desc) - `http://localhost:8080/api/products/?limit=5&page=2&sort=desc` - Método: `GET`.
- [Buscar "teclado", Orden Ascendente](http://localhost:8080/api/products/?query=teclado&sort=asc) - `http://localhost:8080/api/products/?query=teclado&sort=asc` - Método: `GET`.
- [Buscar "teclado", Orden Descendente](http://localhost:8080/api/products/?query=teclado&sort=desc) - `http://localhost:8080/api/products/?query=teclado&sort=desc` - Método: `GET`.
- [Buscar por Categoría: Electrónicos](http://localhost:8080/api/products/?query=categoria:Electrónicos) - `http://localhost:8080/api/products/?query=categoria:Electrónicos` - Método: `GET`.
- [Buscar Productos Disponibles](http://localhost:8080/api/products/?query=disponible:true) - `http://localhost:8080/api/products/?query=disponible:true` - Método: `GET`.