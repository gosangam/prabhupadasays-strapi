# Build stage
FROM node:20-alpine AS builder

# Install dependencies required for building
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build custom plugins
RUN cd src/plugins/url-input && \
    yarn install --frozen-lockfile && \
    yarn build && \
    cd /app

# Build any other custom plugins if they exist
RUN for plugin in src/plugins/*/; do \
    if [ -f "$plugin/package.json" ] && [ "$plugin" != "src/plugins/url-input/" ]; then \
    echo "Building plugin: $plugin" && \
    cd "$plugin" && \
    yarn install --frozen-lockfile && \
    yarn build && \
    cd /app; \
    fi \
    done

# Set NODE_ENV to production
ENV NODE_ENV=production

# Build Strapi admin
RUN yarn build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache vips-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for TypeScript runtime)
RUN yarn install --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database
COPY --from=builder /app/src ./src
COPY --from=builder /app/favicon.png ./favicon.png
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Expose port
EXPOSE 1337

# Start Strapi
CMD ["yarn", "start"]
