# Dockerfile for NestJS API
FROM node:22-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=development
COPY . .
RUN npm run build

FROM node:22-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=development /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/main"]