# Build stage
FROM node:20 

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20

WORKDIR /app

# install serve globally
RUN npm install -g serve

# copy built files
COPY --from=build /app/dist ./dist

EXPOSE 3000

# correct command
CMD ["serve", "-s", "dist", "-l", "3000"]