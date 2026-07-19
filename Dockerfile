# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files first to utilize Docker layer caching
COPY package*.json ./

# Install dependencies deterministically
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the production assets
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.25-alpine

# Copy the built production assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration to override default config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 (preserves compatibility with CI/CD port mapping 80:3000)
EXPOSE 3000

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
