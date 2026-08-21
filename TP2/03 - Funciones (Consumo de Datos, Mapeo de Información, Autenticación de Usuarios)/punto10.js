/**
 * 10. Actualización de Información del Usuario:
 * Crea una función llamada actualizarUsuario que tome un objeto
 * usuario y una lista de cambios a aplicar. La función debe retornar el
 * usuario con las propiedades actualizadas.
 */

function actualizarUsuario(usuario, cambios) {
  // Retorna un nuevo objeto combinando el original con los cambios (inmutable)
  return {
    ...usuario,
    ...cambios
  };
}

console.log("--- Punto 10: Actualización de Información del Usuario ---");

const usuarioOriginal = {
  id: 1,
  nombre: "Agustina",
  email: "agus@ejemplo.com",
  ciudad: "Paraná",
  activo: true
};

const modificaciones = {
  ciudad: "Santa Fe",
  email: "agustina.nueva@ejemplo.com"
};

const usuarioActualizado = actualizarUsuario(usuarioOriginal, modificaciones);

console.log("Usuario original:", usuarioOriginal);
console.log("Usuario actualizado:", usuarioActualizado);
