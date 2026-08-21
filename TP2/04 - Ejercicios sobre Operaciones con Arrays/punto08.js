/**
 * 8. Uso de every:
 * Crea un array de números llamado numeros y usa every para verificar
 * si todos los números son positivos.
 */

const numeros = [3, 7, 12, 19, 25];
const numerosConNegativo = [3, -7, 12, 19, 25];

console.log("--- Punto 8: Uso de every ---");
const todosPositivos1 = numeros.every((num) => num > 0);
console.log("Array [3, 7, 12, 19, 25] - ¿Todos son positivos?:", todosPositivos1); // true

const todosPositivos2 = numerosConNegativo.every((num) => num > 0);
console.log("Array [3, -7, 12, 19, 25] - ¿Todos son positivos?:", todosPositivos2); // false
