# Etapa 1: Build
FROM node:20-bullseye AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile || npm install

COPY . .

ARG EXPO_PUBLIC_API_BASE_URL
ENV EXPO_PUBLIC_API_BASE_URL=$EXPO_PUBLIC_API_BASE_URL

# Build do app web
RUN npx expo export

# Etapa 2: Servir
FROM node:20-bullseye


WORKDIR /app

# Instala um servidor estático
RUN npm install -g serve

# Copia os arquivos buildados da etapa anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
