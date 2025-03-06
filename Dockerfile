# Construction steps
FROM node:22-alpine as builder

# Set the working directory
WORKDIR /app

# Copy the package.json file
COPY package.json package-lock.json ./

# Install exacly the dependencies
RUN npm ci

# Copy the source code
COPY . .

# Build the application
RUN npm run build

# Production steps
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S -u 1001 nextjs -G nodejs

# Copy construction artifacts
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Install only production dependencies
ENV NODE_ENV=production
RUN npm ci --omit=dev && \
  npm cache clean --force

USER nextjs

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
