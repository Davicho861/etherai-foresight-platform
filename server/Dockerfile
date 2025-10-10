# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY server/ ./

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 4001

# Start the application
CMD ["npm", "start"]