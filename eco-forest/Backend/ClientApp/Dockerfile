# Use a Node.js base image
FROM node:16 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration production

# Set up Nginx to serve the app
FROM nginx:alpine
COPY --from=build /app/dist/client-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
