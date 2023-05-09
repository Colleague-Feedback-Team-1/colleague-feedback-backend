# backend_app/Dockerfile
# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app

# Create a non-root user
RUN addgroup -S appuser && adduser -S appuser -G appuser

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci --only=production

# Copy the rest of the application code into the working directory
COPY . .

# Change the ownership of the working directory to the non-root user
RUN chown -R appuser:appuser /usr/src/app

# Switch to the non-root user
USER appuser
