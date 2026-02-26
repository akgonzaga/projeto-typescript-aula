# multi-stage build for a TypeScript/Node.js app

# build stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# install deps and compile
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# production stage
FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 6060
CMD ["node", "dist/server.js"]
