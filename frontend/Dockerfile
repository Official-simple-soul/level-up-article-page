# Use Node.js runtime as the base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if exists) to the working directory
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the frontend application code
COPY . .

# Expose the port on which the server is running
EXPOSE 5173

# Start the dev server
CMD ["pnpm", "run", "dev-container"]