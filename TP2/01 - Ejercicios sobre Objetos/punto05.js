/**
 * 5. Actualización de Propiedades:
 * Modifica el valor de la propiedad precio del objeto producto y luego
 * imprime el objeto completo para verificar el cambio.
 */

const producto = {
  nombre: "Teclado Mecánico",
  precio: 85,
  disponible: true
};

console.log("--- Punto 5: Actualización de Propiedades ---");
console.log("Objeto original:", producto);

producto.precio = 95;

console.log("Objeto modificado:", producto);
