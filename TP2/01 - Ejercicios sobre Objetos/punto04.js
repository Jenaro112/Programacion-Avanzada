/**
 * 4. Iteración sobre Propiedades de un Objeto:
 * Crea un objeto producto con propiedades como nombre, precio y
 * disponible. Usa un bucle for...in para imprimir todas las propiedades
 * y sus valores.
 */

const producto = {
  nombre: "Laptop Lenovo ThinkPad",
  precio: 1200,
  disponible: true
};

console.log("--- Punto 4: Iteración sobre Propiedades de un Objeto ---");
for (const propiedad in producto) {
  console.log(`${propiedad}: ${producto[propiedad]}`);
}
