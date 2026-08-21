/**
 * 6. Uso de reduce:
 * Crea una función llamada sumarElementos que tome un array de
 * números y devuelva la suma de todos los elementos del array
 * usando reduce.
 */

function sumarElementos(numeros) {
  return numeros.reduce((acumulador, elementoActual) => acumulador + elementoActual, 0);
}

console.log("--- Punto 6: Uso de reduce ---");
const numeros = [10, 20, 30, 40, 50];
const total = sumarElementos(numeros);

console.log("Array:", numeros);
console.log("Suma total de elementos:", total);
