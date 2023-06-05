FROM node:18.16.0
WORKDIR ./app
COPY . .
RUN npm ci
EXPOSE 3000
CMD ["npm", "start"]
