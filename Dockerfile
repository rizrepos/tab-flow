FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Dev stage - used with volume mount for live development
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

# Build stage - produces the dist/ output
FROM base AS build
COPY . .
RUN npm run build
