/**
 * 8. Combinar Objetos:
 * Usa Object.assign para combinar dos objetos, persona1 y persona2,
 * en un nuevo objeto. Imprime el resultado.
 */

const persona1 = {
  nombre: "Lucía",
  edad: 28
};

const persona2 = {
  profesion: "Desarrolladora Web",
  ciudad: "Rosario"
};

const personaCombinada = Object.assign({}, persona1, persona2);

console.log("--- Punto 8: Combinar Objetos ---");
console.log("persona1:", persona1);
console.log("persona2:", persona2);
console.log("Objeto combinado:", personaCombinada);
