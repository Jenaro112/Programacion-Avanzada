/**
 * 3. Métodos en Objetos:
 * Añade un método llamado descripción al objeto libro que devuelva
 * una cadena describiendo el título y el autor del libro. Invoca este
 * método e imprime el resultado.
 */

const libro = {
  titulo: "Don Quijote de la Mancha",
  autor: "Miguel de Cervantes",
  añoDePublicacion: 1605,
  descripcion() {
    return `El libro "${this.titulo}" fue escrito por ${this.autor}.`;
  }
};

console.log("--- Punto 3: Métodos en Objetos ---");
console.log(libro.descripcion());
