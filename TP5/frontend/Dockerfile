# * Usamos la imagen oficial de Node.js basada en Alpine (más ligera)
FROM node:20-alpine

# * Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# * Copiamos los archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# * Instalamos las dependencias
RUN npm install

# * Copiamos el resto del código fuente al contenedor
COPY . .

# * Exponemos el puerto que Vite usará
EXPOSE 5173

# * Comando para iniciar el servidor de desarrollo de Vite
CMD ["npm", "run", "dev"]
