/**
 * 6. Función Recursiva:
 * Crea una función recursiva llamada factorial que calcule el factorial
 * de un número dado.
 */

function factorial(n) {
  if (n < 0) {
    throw new Error("No existe el factorial para números negativos.");
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log("--- Punto 6: Función Recursiva ---");
console.log("Factorial de 0:", factorial(0)); // 1
console.log("Factorial de 1:", factorial(1)); // 1
console.log("Factorial de 5:", factorial(5)); // 120 (5 * 4 * 3 * 2 * 1)
console.log("Factorial de 6:", factorial(6)); // 720
