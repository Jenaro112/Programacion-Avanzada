/**
 * 5. Validación de Formularios:
 * Crea una función llamada validarFormulario que tome un objeto con
 * los campos nombre, email y password. La función debe devolver true
 * si todos los campos están presentes y no están vacíos, y false en caso
 * contrario.
 */

function validarFormulario(formulario) {
  if (!formulario || typeof formulario !== "object") {
    return false;
  }

  const { nombre, email, password } = formulario;

  const esNoVacio = (valor) => typeof valor === "string" && valor.trim().length > 0;

  return esNoVacio(nombre) && esNoVacio(email) && esNoVacio(password);
}

console.log("--- Punto 5: Validación de Formularios ---");

const formCorrecto = {
  nombre: "Juan Pérez",
  email: "juan@example.com",
  password: "miPasswordSeguro123"
};

const formIncompleto = {
  nombre: "Ana Gómez",
  email: "",
  password: "123"
};

const formFaltante = {
  nombre: "Carlos",
  email: "carlos@test.com"
};

console.log("Formulario correcto:", validarFormulario(formCorrecto)); // true
console.log("Formulario con campo vacío:", validarFormulario(formIncompleto)); // false
console.log("Formulario con campo faltante:", validarFormulario(formFaltante)); // false
