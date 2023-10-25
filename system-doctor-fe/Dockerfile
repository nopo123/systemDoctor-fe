# Use an official Node.js runtime as a parent image
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json separately to take advantage of Docker layer caching
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy your application code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Create a production image
FROM nginx:alpine

# Copy the built production files from the previous stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 (the default for HTTP traffic)
EXPOSE 80

# Start the NGINX web server
CMD ["nginx", "-g", "daemon off;"]
