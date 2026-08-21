/**
 * 1. Agregar y Eliminar Elementos:
 * Crea un array frutas con los valores ["manzana", "banana", "pera"]. Usa
 * push para agregar una fruta al final, y pop para eliminar la última
 * fruta.
 */

const frutas = ["manzana", "banana", "pera"];
console.log("--- Punto 1: Agregar y Eliminar Elementos ---");
console.log("Array inicial:", frutas);

// Agregamos una fruta al final con push
frutas.push("naranja");
console.log("Después de push('naranja'):", frutas);

// Eliminamos la última fruta con pop
const frutaEliminada = frutas.pop();
console.log("Fruta eliminada con pop():", frutaEliminada);
console.log("Array final:", frutas);
