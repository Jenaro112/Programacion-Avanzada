/**
 * 6. Paginación de Datos:
 * Crea una función llamada obtenerPagina que tome un array de
 * datos y un número de página. La función debe devolver los
 * elementos correspondientes a esa página, asumiendo que cada
 * página tiene 5 elementos.
 */

function obtenerPagina(datos, numeroPagina) {
  const ELEMENTOS_POR_PAGINA = 5;

  if (!Array.isArray(datos) || numeroPagina < 1) {
    return [];
  }

  const indiceInicio = (numeroPagina - 1) * ELEMENTOS_POR_PAGINA;
  const indiceFin = indiceInicio + ELEMENTOS_POR_PAGINA;

  return datos.slice(indiceInicio, indiceFin);
}

console.log("--- Punto 6: Paginación de Datos ---");

// Array de ejemplo con 12 elementos
const elementos = [
  "Elemento 1", "Elemento 2", "Elemento 3", "Elemento 4", "Elemento 5",
  "Elemento 6", "Elemento 7", "Elemento 8", "Elemento 9", "Elemento 10",
  "Elemento 11", "Elemento 12"
];

console.log("Página 1 (elementos 1 al 5):", obtenerPagina(elementos, 1));
console.log("Página 2 (elementos 6 al 10):", obtenerPagina(elementos, 2));
console.log("Página 3 (elementos 11 al 12):", obtenerPagina(elementos, 3));
