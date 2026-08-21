/**
 * 7. Función con Función Interna:
 * Crea una función llamada despedir que contenga una función
 * interna adios. despedir debe devolver el resultado de llamar a adios.
 */

function despedir() {
  function adios() {
    return "¡Hasta luego! Gracias por tu visita.";
  }
  return adios();
}

console.log("--- Punto 7: Función con Función Interna ---");
console.log(despedir());
