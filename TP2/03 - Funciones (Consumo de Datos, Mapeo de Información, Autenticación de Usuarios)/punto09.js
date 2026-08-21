/**
 * 9. Generación de Token de Autenticación:
 * Crea una función llamada generarToken que tome un objeto usuario
 * y devuelva un token JWT simulado como una cadena. Puedes usar
 * una función como btoa (Base64) para simular la generación del
 * token.
 */

// Helper para codificar en Base64 compatible tanto en Node.js como en navegadores
function codificarBase64(cadena) {
  if (typeof btoa === "function") {
    return btoa(cadena);
  }
  return Buffer.from(cadena).toString("base64url");
}

function generarToken(usuario) {
  // 1. Header simulado
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  // 2. Payload simulado con datos del usuario y fecha de expiración
  const payload = {
    ...usuario,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
  };

  const headerCodificado = codificarBase64(JSON.stringify(header));
  const payloadCodificado = codificarBase64(JSON.stringify(payload));

  // 3. Firma simulada (en un JWT real se firma con clave secreta)
  const firmaSimulada = codificarBase64(`firma_secreta_${payloadCodificado}`);

  return `${headerCodificado}.${payloadCodificado}.${firmaSimulada}`;
}

console.log("--- Punto 9: Generación de Token de Autenticación ---");

const usuarioPrueba = {
  id: 101,
  usuario: "jenaro",
  rol: "admin"
};

const token = generarToken(usuarioPrueba);
console.log("Token JWT simulado generado:\n", token);
