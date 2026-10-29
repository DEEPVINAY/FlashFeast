# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package dependency manifests
COPY package*.json ./

# Install dependencies deterministically
RUN npm ci

# Copy source code and build frontend
COPY . .
RUN npm run build

# Stage 2: Production runtime with Node.js
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend assets and server application
COPY --from=build /app/dist ./dist
COPY server ./server

# Cloud Run injects PORT (defaults to 8080)
EXPOSE 8080

# Start the unified Node.js server (serving API + React SPA)
CMD ["node", "server/index.js"]
