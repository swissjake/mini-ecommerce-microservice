# Base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

EXPOSE 5000

# Run migration and then start the app
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run dev"]