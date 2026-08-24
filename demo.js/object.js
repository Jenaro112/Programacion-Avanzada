//* objetos literales
const persona = {
    nombre: "Juan",
    edad: 30,
    profesion: "Desarrollador",
    saludar: function () {
        console.log(`Hola, soy ${this.nombre} y tengo ${this.edad} años.`);
    },
};

persona.saludar();
