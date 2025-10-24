# Stage 1: Build
FROM node:20-alpine AS builder

# Enable Corepack and prepare Yarn
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy workspace package.json files
COPY packages/client/package.json ./packages/client/

# Install all dependencies
RUN yarn install --immutable

# Copy source code
COPY packages/client ./packages/client

# Build argument for API URL
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application
WORKDIR /app/packages/client
RUN yarn build

# Stage 2: Production
FROM node:20-alpine AS production

# Enable Corepack and prepare Yarn
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy workspace package.json files
COPY packages/client/package.json ./packages/client/

# Install production dependencies only
RUN yarn workspaces focus @archi/client --production

# Copy built application from builder
COPY --from=builder /app/packages/client/.next ./packages/client/.next
COPY --from=builder /app/packages/client/public ./packages/client/public
COPY --from=builder /app/packages/client/next.config.ts ./packages/client/next.config.ts

# Set working directory to client
WORKDIR /app/packages/client

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the Next.js application
CMD ["yarn", "start"]
