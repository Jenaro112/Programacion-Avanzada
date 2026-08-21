/**
 * 3. Autenticación Simulada:
 * Crea una función llamada autenticarUsuario que tome un objeto
 * credenciales con usuario y contraseña, y verifique si coinciden con
 * un usuario predefinido. La función debe devolver true si la
 * autenticación es exitosa y false en caso contrario.
 */

// Usuario registrado en el sistema
const usuarioRegistrado = {
  usuario: "admin",
  contrasenia: "secreto123"
};

function autenticarUsuario(credenciales) {
  if (!credenciales || !credenciales.usuario || !credenciales.contrasenia) {
    return false;
  }
  return (
    credenciales.usuario === usuarioRegistrado.usuario &&
    credenciales.contrasenia === usuarioRegistrado.contrasenia
  );
}

console.log("--- Punto 3: Autenticación Simulada ---");
console.log("Prueba 1 (Correcta):", autenticarUsuario({ usuario: "admin", contrasenia: "secreto123" })); // true
console.log("Prueba 2 (Contraseña errónea):", autenticarUsuario({ usuario: "admin", contrasenia: "incorrecta" })); // false
console.log("Prueba 3 (Usuario inexistente):", autenticarUsuario({ usuario: "pepe", contrasenia: "secreto123" })); // false
