# 🌍 Safariya - Africa Explorer | Hive Blockchain Game

FROM node:20-alpine AS frontend-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --legacy-peer-deps
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy backend files
COPY package*.json ./
RUN npm ci --production --legacy-peer-deps

COPY server/ ./server/

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist

# Create data directory for game DB
RUN mkdir -p ./server/data

# Environment
ENV NODE_ENV=production
ENV PORT=8095

# Non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S safariya -u 1001
RUN chown -R safariya:nodejs /app
USER safariya

EXPOSE 8095

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q -O- http://localhost:8095/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"]
