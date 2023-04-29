FROM node:16-alpine AS builder

WORKDIR /app
COPY package.json package.json
COPY . .

RUN npm install --force
RUN npm run build
RUN cp .env dist/
RUN cp -r node_modules/ dist/

FROM node:16-alpine AS app
RUN apk add --no-cache chromium
RUN npm install pm2 -g
ENV NODE_ENV=production
WORKDIR /app
COPY . .
COPY --from=builder /app/dist dist/
EXPOSE 3333
ENTRYPOINT [ "npm", "run", "docker:start" ]
