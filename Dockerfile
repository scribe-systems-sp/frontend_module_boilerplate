FROM node:12.16.3-slim
COPY . /app
WORKDIR /app
RUN npm install && npm run build