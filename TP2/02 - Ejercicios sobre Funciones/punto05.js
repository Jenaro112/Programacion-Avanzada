/**
 * 5. Función que Modifica un Objeto:
 * Crea una función llamada actualizarEdad que tome un objeto
 * persona y un número nuevaEdad, y actualice la propiedad edad del
 * objeto.
 */

function actualizarEdad(persona, nuevaEdad) {
  persona.edad = nuevaEdad;
  return persona;
}

console.log("--- Punto 5: Función que Modifica un Objeto ---");
const persona = {
  nombre: "Franco",
  edad: 20
};

console.log("Antes de actualizar:", persona);
actualizarEdad(persona, 21);
console.log("Después de actualizar:", persona);
