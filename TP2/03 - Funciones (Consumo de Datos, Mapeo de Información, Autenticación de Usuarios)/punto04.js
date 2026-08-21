/**
 * 4. Transformación de Datos:
 * Crea una función llamada mapearUsuarios que tome un array de
 * usuarios obtenidos de la API y devuelva un nuevo array con solo las
 * propiedades nombre y email de cada usuario.
 */

function mapearUsuarios(usuarios) {
  return usuarios.map((usuario) => ({
    nombre: usuario.name || usuario.nombre,
    email: usuario.email
  }));
}

console.log("--- Punto 4: Transformación de Datos ---");

// Array de ejemplo similar a los datos de la API JSONPlaceholder
const listaUsuariosAPI = [
  { id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz", phone: "1-770-736-8031" },
  { id: 2, name: "Ervin Howell", username: "Antonette", email: "Shanna@melissa.tv", phone: "010-692-6593" },
  { id: 3, name: "Clementine Bauch", username: "Samantha", email: "Nathan@yesenia.net", phone: "1-463-123-4447" }
];

const usuariosMapeados = mapearUsuarios(listaUsuariosAPI);
console.log("Usuarios transformados:", usuariosMapeados);
