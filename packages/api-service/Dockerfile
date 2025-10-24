# Stage 1: Build
FROM node:20-alpine AS builder

# Enable Corepack and prepare Yarn
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy workspace package.json files
COPY packages/api-service/package.json ./packages/api-service/

# Install all dependencies (including devDependencies for build)
RUN yarn install --immutable

# Copy source code
COPY packages/api-service ./packages/api-service

# Build the application
WORKDIR /app/packages/api-service
RUN yarn build:esbuild

# Stage 2: Production
FROM node:20-alpine AS production

# Enable Corepack and prepare Yarn
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy workspace package.json files
COPY packages/api-service/package.json ./packages/api-service/

# Install production dependencies only
RUN yarn workspaces focus @archi/api-service --production

# Copy built application from builder
COPY --from=builder /app/packages/api-service/dist ./packages/api-service/dist
COPY --from=builder /app/packages/api-service/public ./packages/api-service/public

# Set working directory to api-service
WORKDIR /app/packages/api-service

# Expose port
EXPOSE 3001

# Health check endpoint (optional, adjust if you have a different health endpoint)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "dist/index.js"]
