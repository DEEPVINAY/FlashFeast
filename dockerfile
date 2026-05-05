# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20

WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]