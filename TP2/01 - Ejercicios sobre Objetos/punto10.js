/**
 * 10. Métodos Getters y Setters:
 * Añade un getter y un setter al objeto libro para la propiedad
 * añoDePublicacion. Usa el setter para actualizar el año de publicación
 * y luego usa el getter para leerlo.
 */

const libro = {
  titulo: "El Aleph",
  autor: "Jorge Luis Borges",
  _añoDePublicacion: 1949,

  get añoDePublicacion() {
    return this._añoDePublicacion;
  },

  set añoDePublicacion(nuevoAño) {
    if (typeof nuevoAño === "number" && nuevoAño > 0) {
      this._añoDePublicacion = nuevoAño;
    } else {
      console.error("El año debe ser un número válido.");
    }
  }
};

console.log("--- Punto 10: Métodos Getters y Setters ---");
console.log("Año de publicación inicial (vía getter):", libro.añoDePublicacion);

// Actualizamos con el setter
libro.añoDePublicacion = 1952;
console.log("Año de publicación actualizado (vía getter):", libro.añoDePublicacion);
