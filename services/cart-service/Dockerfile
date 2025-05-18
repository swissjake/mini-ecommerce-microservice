# Base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package files first (leverages Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN mkdir -p dist && npm run build

# Expose the port the app runs on (optional unless used with Docker networking)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
