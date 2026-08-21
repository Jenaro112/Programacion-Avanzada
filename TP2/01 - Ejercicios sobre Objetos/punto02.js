/**
 * 2. Anidación de Objetos:
 * Crea un objeto llamado estudiante con propiedades nombre, edad y
 * direccion. direccion debe ser otro objeto con propiedades calle,
 * ciudad y pais. Imprime la dirección completa del estudiante.
 */

const estudiante = {
  nombre: "Carlos Gómez",
  edad: 21,
  direccion: {
    calle: "Av. San Martín 1234",
    ciudad: "Paraná",
    pais: "Argentina"
  }
};

console.log("--- Punto 2: Anidación de Objetos ---");
console.log(`Dirección completa: ${estudiante.direccion.calle}, ${estudiante.direccion.ciudad}, ${estudiante.direccion.pais}`);
