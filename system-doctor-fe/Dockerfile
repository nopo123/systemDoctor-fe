# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy your application code
COPY . .

# Expose port 3001 to the outside world
EXPOSE 5000

# Start the React app
CMD ["npm", "start"]