/**
 * 7. Uso de some:
 * Crea un array de números llamado numeros y usa some para
 * verificar si algún número es mayor que 10.
 */

const numeros = [2, 5, 8, 1, 14, 4];

console.log("--- Punto 7: Uso de some ---");
console.log("Array de números:", numeros);

const existeMayorQue10 = numeros.some((num) => num > 10);
console.log("¿Existe algún número mayor que 10?:", existeMayorQue10); // true
