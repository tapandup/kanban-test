# ========= build =========
FROM node:20-alpine AS builder
WORKDIR /app

# Necesario para Prisma en Alpine
RUN apk add --no-cache openssl

# Instala deps sin exigir lock
COPY package*.json ./
RUN npm install

# Prisma: copiar schema y generar cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copiar el resto del código
COPY . .

# Variables por defecto para build (ajusta si usas otro path)
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./dev.db"

# En lugar de migrate deploy (que requiere migraciones), empuja el schema
RUN npx prisma db push --accept-data-loss && npm run build

# ========= runtime =========
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Traer lo necesario del build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm","start"]
