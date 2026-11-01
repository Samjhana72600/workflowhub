# ---- Stage 1: build the React app ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# API URL is baked into the bundle at build time
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Stage 2: serve the static files with nginx ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
