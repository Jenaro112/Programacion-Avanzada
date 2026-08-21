/**
 * 7. Eliminación de Propiedades:
 * Elimina la propiedad disponible del objeto producto. Imprime el
 * objeto antes y después de eliminar la propiedad.
 */

const producto = {
  nombre: "Monitor 27 pulgadas",
  precio: 300,
  disponible: true
};

console.log("--- Punto 7: Eliminación de Propiedades ---");
console.log("Antes de eliminar la propiedad:", producto);

delete producto.disponible;

console.log("Después de eliminar la propiedad:", producto);
