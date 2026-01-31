# Multi-stage build for optimized frontend
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean install
RUN npm ci --only=production

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Production stage with Nginx
FROM nginx:1.25-alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add health check script
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'curl -f http://localhost/health || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /healthcheck.sh

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
