/**
 * 9. Copiar Objetos:
 * Crea una copia profunda del objeto estudiante utilizando el método
 * JSON.parse y JSON.stringify. Modifica la copia y verifica que el objeto
 * original no haya sido alterado.
 */

const estudiante = {
  nombre: "Martina",
  edad: 22,
  direccion: {
    calle: "Corrientes 500",
    ciudad: "Buenos Aires",
    pais: "Argentina"
  }
};

// Copia profunda
const copiaEstudiante = JSON.parse(JSON.stringify(estudiante));

// Modificamos la copia (tanto propiedad primitiva como anidada)
copiaEstudiante.nombre = "Valentina";
copiaEstudiante.direccion.ciudad = "Córdoba";

console.log("--- Punto 9: Copiar Objetos ---");
console.log("Objeto original (estudiante):", estudiante);
console.log("Copia modificada (copiaEstudiante):", copiaEstudiante);
console.log("¿El objeto original quedó inalterado?:", estudiante.direccion.ciudad !== copiaEstudiante.direccion.ciudad && estudiante.nombre !== copiaEstudiante.nombre);
