# * Usamos la imagen oficial de Node.js basada en Alpine Linux por ser más ligera
FROM node:20-alpine

# * Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# * Copiamos los archivos de definición de dependencias
COPY package*.json ./

# * Instalamos las dependencias
RUN npm install

# * Copiamos el resto del código de la aplicación al contenedor
COPY . .

# * Exponemos el puerto en el que la aplicación va a escuchar
EXPOSE 3001

# * Definimos el comando para iniciar la aplicación
CMD ["node", "src/index.js"]
