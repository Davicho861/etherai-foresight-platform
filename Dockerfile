FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
# Use npm ci with the unified lockfile for reproducible builds
RUN npm ci --only=production --no-audit --no-fund --prefer-offline || true
COPY . .
EXPOSE 4000
CMD ["node", "src/index.js"]
