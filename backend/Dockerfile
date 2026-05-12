FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript if needed
RUN if [ -f tsconfig.json ]; then npm run build; fi

EXPOSE 5000

# Use production start command
CMD ["npm", "start"]