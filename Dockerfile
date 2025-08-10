# -------- Deps --------
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package*.json ./
# usa npm ci si tienes package-lock.json, si no npm i
RUN npm ci --omit=dev || npm install --omit=dev

# -------- Build --------
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# genera Prisma (no necesita la BD)
RUN npx prisma generate
RUN npm run build

# -------- Runtime --------
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# copia lo mínimo para correr
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Ejecuta migraciones al iniciar y luego levanta Next
CMD sh -c "npm run migrate && npm run start"
