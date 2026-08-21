/**
 * 6. Comprobación de Propiedades:
 * Crea una función llamada tienePropiedad que tome un objeto y una
 * cadena como parámetros, y devuelva true si el objeto tiene una
 * propiedad con ese nombre, o false en caso contrario.
 */

function tienePropiedad(objeto, propiedad) {
  return Object.hasOwn(objeto, propiedad) || propiedad in objeto;
}

console.log("--- Punto 6: Comprobación de Propiedades ---");
const auto = {
  marca: "Toyota",
  modelo: "Corolla",
  anio: 2022
};

console.log('¿Tiene propiedad "marca"?:', tienePropiedad(auto, "marca")); // true
console.log('¿Tiene propiedad "color"?:', tienePropiedad(auto, "color")); // false
