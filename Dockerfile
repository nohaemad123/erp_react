# Use Node.js v22 as the base image
FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application files, excluding node_modules (thanks to .dockerignore)
COPY . .

# Build the Next.js app for production
RUN pnpm build

# Expose the default port for Next.js (3000)
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start"]
