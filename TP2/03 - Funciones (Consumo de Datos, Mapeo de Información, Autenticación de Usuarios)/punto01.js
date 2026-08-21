/**
 * 1. Consumo de Datos desde una API:
 * Crea una función llamada obtenerUsuarios que haga una petición
 * HTTP a la API https://jsonplaceholder.typicode.com/users usando
 * fetch. Luego, imprime en la consola la lista de usuarios obtenida.
 */

async function obtenerUsuarios() {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!respuesta.ok) {
      throw new Error(`Error en la petición: ${respuesta.status}`);
    }
    const usuarios = await respuesta.json();
    console.log("--- Punto 1: Consumo de Datos desde una API ---");
    console.log("Lista de usuarios obtenida:", usuarios);
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
  }
}

// Ejecución de prueba
obtenerUsuarios();
