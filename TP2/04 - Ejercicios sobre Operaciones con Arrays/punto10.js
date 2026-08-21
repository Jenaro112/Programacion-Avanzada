/**
 * 10. Uso de sort:
 * Crea un array de palabras y ordénalo alfabéticamente usando sort.
 */

const palabras = ["zapato", "manzana", "árbol", "casa", "barco", "delfín"];

console.log("--- Punto 10: Uso de sort ---");
console.log("Array original:", palabras);

// Usamos localeCompare para ordenar correctamente considerando caracteres en español (como tildes)
const palabrasOrdenadas = [...palabras].sort((a, b) => a.localeCompare(b, "es"));

console.log("Array ordenado alfabéticamente:", palabrasOrdenadas);
