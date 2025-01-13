# Use a more recent Node.js version (e.g., v18)
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY ./ClientApp/package.json ./ClientApp/package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the entire ClientApp directory
COPY ./ClientApp /app/

# Build the frontend
RUN npm run build

# Expose the port the app runs on
EXPOSE 4200

# Command to run the frontend server
CMD ["npm", "start"]
