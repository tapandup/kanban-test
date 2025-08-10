# -----------------------------
# Etapa 1: deps (instala node_modules)
# -----------------------------
FROM node:20-alpine AS deps
WORKDIR /app
# Prisma en Alpine necesita openssl y compatibilidad glibc
RUN apk add --no-cache libc6-compat openssl
# Copiamos SOLO los manifests para aprovechar la cache
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
# Si hay package-lock -> npm ci; si no, npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# -----------------------------
# Etapa 2: builder (build de la app)
# -----------------------------
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
ENV NEXT_TELEMETRY_DISABLED=1
# Trae node_modules ya resueltos
COPY --from=deps /app/node_modules ./node_modules
# Trae TODO el código
COPY . .
# Genera el cliente de Prisma y compila Next
RUN npx prisma generate
RUN npm run build

# -----------------------------
# Etapa 3: runner (runtime)
# -----------------------------
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl && \
    addgroup -S nodejs && adduser -S nextjs -G nodejs
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="file:/data/dev.db"
# Copiamos lo mínimo para ejecutar
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
# Donde vivirá tu sqlite para que sea persistente
VOLUME /data
EXPOSE 3000
# Migra/Pusha el schema en arranque y levanta Next
CMD ["sh", "-c", "npx prisma db push && npm run start"]
