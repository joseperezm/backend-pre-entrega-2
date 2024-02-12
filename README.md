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