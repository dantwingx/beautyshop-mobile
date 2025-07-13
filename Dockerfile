# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app files
COPY . .

# Build the app with production API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx config for Railway
# Railway expects the app to listen on $PORT (not port 80)
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Tell Railway we're listening on port 8080
EXPOSE 8080

# Start nginx with custom config
CMD ["sh", "-c", "sed -i \"s/listen 8080;/listen ${PORT:-8080};/g\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]