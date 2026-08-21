/**
 * 9. Función que Devuelve Otra Función:
 * Crea una función llamada crearMultiplicador que tome un número x
 * y devuelva una nueva función que multiplique cualquier número por
 * x.
 */

function crearMultiplicador(x) {
  return function (numero) {
    return numero * x;
  };
}

console.log("--- Punto 9: Función que Devuelve Otra Función ---");
const multiplicarPor3 = crearMultiplicador(3);
const multiplicarPor10 = crearMultiplicador(10);

console.log("3 multiplicado por 4:", multiplicarPor3(4)); // 12
console.log("10 multiplicado por 5:", multiplicarPor10(5)); // 50
