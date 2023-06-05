FROM node:16.15.0
WORKDIR ./app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
