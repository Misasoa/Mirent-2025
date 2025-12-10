# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:prod"]
