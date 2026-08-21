/**
 * 9. Uso de find:
 * Crea un array de objetos llamados personas donde cada objeto
 * tenga nombre y edad. Usa find para encontrar a la primera persona
 * mayor de 30 años.
 */

const personas = [
  { nombre: "Sofía", edad: 22 },
  { nombre: "Mateo", edad: 28 },
  { nombre: "Laura", edad: 35 },
  { nombre: "Gabriel", edad: 42 }
];

console.log("--- Punto 9: Uso de find ---");
const primeraPersonaMayor30 = personas.find((persona) => persona.edad > 30);

console.log("Personas:", personas);
console.log("Primera persona mayor de 30 años:", primeraPersonaMayor30);
