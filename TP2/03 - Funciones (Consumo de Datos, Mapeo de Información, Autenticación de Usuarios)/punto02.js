/**
 * 2. Procesamiento de Datos de una API:
 * Usando la función obtenerUsuarios, crea otra función llamada
 * imprimirNombresDeUsuarios que filtre y muestre solo los nombres
 * de los usuarios.
 */

async function obtenerUsuarios() {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!respuesta.ok) {
      throw new Error(`Error en la petición: ${respuesta.status}`);
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    return [];
  }
}

async function imprimirNombresDeUsuarios() {
  const usuarios = await obtenerUsuarios();
  console.log("--- Punto 2: Procesamiento de Datos de una API ---");
  console.log("Nombres de los usuarios:");
  usuarios.forEach((usuario, index) => {
    console.log(`${index + 1}. ${usuario.name}`);
  });
}

// Ejecución de prueba
imprimirNombresDeUsuarios();
