# Use Node.js 20 as the base image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=base /app .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
