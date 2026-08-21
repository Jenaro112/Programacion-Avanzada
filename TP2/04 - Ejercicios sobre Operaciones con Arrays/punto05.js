/**
 * 5. Uso de filter:
 * Crea una función llamada filtrarMayoresDe que tome un array de
 * números y un valor de referencia, y devuelva un nuevo array solo con
 * los números mayores que ese valor. Usa filter.
 */

function filtrarMayoresDe(numeros, valorReferencia) {
  return numeros.filter((num) => num > valorReferencia);
}

console.log("--- Punto 5: Uso de filter ---");
const numeros = [5, 12, 8, 130, 44, 3, 27];
const resultado = filtrarMayoresDe(numeros, 10);

console.log("Array original:", numeros);
console.log("Números mayores que 10:", resultado);
