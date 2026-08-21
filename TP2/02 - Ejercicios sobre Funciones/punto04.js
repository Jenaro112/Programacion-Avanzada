/**
 * 4. Función que Devuelve un Objeto:
 * Crea una función llamada crearPersona que tome nombre y edad
 * como parámetros y devuelva un objeto con esas propiedades.
 */

function crearPersona(nombre, edad) {
  return {
    nombre: nombre,
    edad: edad
  };
}

console.log("--- Punto 4: Función que Devuelve un Objeto ---");
const nuevaPersona = crearPersona("Luciano", 25);
console.log(nuevaPersona);
