# * 1. Etapa de dependencias (builder)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# * Instalamos solo las dependencias de produccion
RUN npm install --omit=dev

# * 2. Etapa final (produccion)
FROM node:20-alpine
WORKDIR /app

# * Copiamos node_modules y el codigo desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY . .

EXPOSE 3001
CMD ["node", "server.js"]
