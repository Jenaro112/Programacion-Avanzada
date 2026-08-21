/**
 * 7. Envío de Datos a una API:
 * Crea una función llamada enviarDatos que tome un objeto data y
 * haga una petición POST a la API
 * https://jsonplaceholder.typicode.com/posts. La función debe
 * imprimir la respuesta de la API.
 */

async function enviarDatos(data) {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(data)
    });

    if (!respuesta.ok) {
      throw new Error(`Error en el envío: ${respuesta.status}`);
    }

    const resultado = await respuesta.json();
    console.log("--- Punto 7: Envío de Datos a una API ---");
    console.log("Respuesta recibida del servidor:", resultado);
    return resultado;
  } catch (error) {
    console.error("Error al enviar los datos:", error.message);
  }
}

// Ejecución de prueba con datos de ejemplo
const nuevoPost = {
  title: "Publicación de prueba",
  body: "Contenido del post enviado desde JavaScript",
  userId: 1
};

enviarDatos(nuevoPost);
