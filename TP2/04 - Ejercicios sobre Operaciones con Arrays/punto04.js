/**
 * 4. Uso de map:
 * Crea una función llamada elevarAlCuadrado que tome un array de
 * números y devuelva un nuevo array con cada número elevado al
 * cuadrado. Usa map para implementar la función.
 */

function elevarAlCuadrado(numeros) {
  return numeros.map((num) => num ** 2);
}

console.log("--- Punto 4: Uso de map ---");
const numeros = [1, 2, 3, 4, 5, 6];
const alCuadrado = elevarAlCuadrado(numeros);

console.log("Array original:", numeros);
console.log("Array al cuadrado:", alCuadrado);
