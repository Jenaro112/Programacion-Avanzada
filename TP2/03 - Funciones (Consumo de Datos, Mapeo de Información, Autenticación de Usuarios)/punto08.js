/**
 * 8. Búsqueda de Usuarios:
 * Crea una función llamada buscarUsuarioPorEmail que tome un array
 * de usuarios y un email como parámetros, y devuelva el usuario que
 * coincida con el email proporcionado. Usa el método find para
 * implementarlo.
 */

function buscarUsuarioPorEmail(usuarios, email) {
  return usuarios.find(
    (usuario) => usuario.email.toLowerCase() === email.toLowerCase()
  );
}

console.log("--- Punto 8: Búsqueda de Usuarios ---");

const listaUsuarios = [
  { id: 1, nombre: "Ana", email: "ana@correo.com" },
  { id: 2, nombre: "Lucas", email: "lucas@correo.com" },
  { id: 3, nombre: "Sofía", email: "sofia@correo.com" }
];

const encontrado = buscarUsuarioPorEmail(listaUsuarios, "lucas@correo.com");
console.log("Usuario encontrado:", encontrado);

const noEncontrado = buscarUsuarioPorEmail(listaUsuarios, "nadie@correo.com");
console.log("Usuario no existente:", noEncontrado); // undefined
