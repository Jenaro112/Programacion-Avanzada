/**
 * 8. Función que Usa Otra Función:
 * Crea una función llamada procesarArray que tome un array y una
 * función como parámetros, y aplique la función a cada elemento del
 * array. Usa una función como parámetro para multiplicar cada
 * número por 2.
 */

function procesarArray(array, funcion) {
  const resultado = [];
  for (let i = 0; i < array.length; i++) {
    resultado.push(funcion(array[i]));
  }
  return resultado;
}

// Función callback para duplicar el número
function duplicar(numero) {
  return numero * 2;
}

console.log("--- Punto 8: Función que Usa Otra Función ---");
const numerosOriginales = [1, 2, 3, 4, 5];
const numerosDuplicados = procesarArray(numerosOriginales, duplicar);

console.log("Array original:", numerosOriginales);
console.log("Array procesado (multiplicado por 2):", numerosDuplicados);
