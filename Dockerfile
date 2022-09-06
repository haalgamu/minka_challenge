FROM node:16.17.0-alpine3.16

WORKDIR /zef

COPY package.json ./
COPY package-lock.json ./

RUN npm install
#RUN npm ci --only=production

COPY . .
CMD ["npm", "run", "build"]
CMD ["npm", "run", "start:prod"]
EXPOSE 3000