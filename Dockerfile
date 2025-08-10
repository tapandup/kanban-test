# Imagen base
FROM node:20-alpine AS base
WORKDIR /app

# Dependencia del sistema para Prisma (openssl)
RUN apk add --no-cache openssl

# Copiar manifiestos (lockfile opcional)
# Esto copia package.json y, si existe, package-lock.json
COPY package.json package-lock.json* ./

# Instalar dependencias
# (npm ci requiere lockfile; usamos npm install para que funcione con o sin lock)
RUN npm install

# Copiar el resto del código
COPY . .

# (opcional) Generar Prisma client; tu script "build" ya lo hace,
# pero esto acelera un poco el build en algunas imágenes
RUN npx prisma generate

# Build de producción (tu script hace generate + migrate deploy + build)
RUN npm run build

# Variables por defecto y puerto
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Arranque
CMD ["npm","start"]
