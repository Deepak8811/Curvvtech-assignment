# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application's source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "src/index.js"]
