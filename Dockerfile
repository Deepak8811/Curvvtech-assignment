# ================================================
# Build Stage
# ================================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (if needed)
# RUN npm run build

# ================================================
# Production Stage
# ================================================
FROM node:18-alpine

# Install dumb-init for better process handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env* ./

# Create necessary directories
RUN mkdir -p logs

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}/health', (res) => { if (res.statusCode !== 200) throw new Error() }).on('error', () => { process.exit(1) })"

# Expose the port the app runs on
EXPOSE ${PORT:-3000}

# Use dumb-init as the entry point
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the application
CMD ["node", "src/index.js"]
