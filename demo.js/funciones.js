//* function declaration

function saludar(nombre) {
    console.log(`Hola ${nombre}`);
}

saludar("Juan");
saludar("Maria");
saludar("Pedro");

//* function expression
const saludar2 = function (nombre) {
    console.log(`Hola ${nombre}`);
};

saludar2("Mariano");
saludar2("Mariana");
saludar2("Pedro");

//* function arrow

const saludar3 = (nombre) => {
    console.log(`Hola ${nombre}`);
};

saludar3("Juan2");
saludar3("Maria2");
saludar3("Pedro2");

//* funciones con parametros por defecto
const actividad = (nombre, rol) => {
    console.log(`La persona ${nombre}, esta realizando la 
        tarea de ${rol}`);
};

actividad("Juan", "programador JS");
actividad("Maria", "analista de datos");
actividad("Pedro", "diseñador web");
actividad("Ana", "gerente de proyecto");
actividad("Luis", "desarrollador web");
actividad("Laura", "analista de datos");
actividad("Carlos", "programador JS");
actividad("Maria", "analista de datos");
actividad("Pedro", "diseñador web");
actividad("Ana", "gerente de proyecto");
actividad("Luis", "desarrollador web");
actividad("Laura", "analista de datos");
actividad("Carlos", "programador JS");

//* parametros por default de las funciones
const actividad2 = (nombre, rol = "programador JS") => {
    console.log(`La persona ${nombre}, esta realizando la 
        tarea de ${rol}`);
};

actividad2("Juan");
actividad2("Maria");
actividad2("Pedro");
actividad2("Ana");
actividad2("Luis");
actividad2("Laura");
actividad2("Carlos");
