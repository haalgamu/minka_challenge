FROM node:16.17.0-alpine3.16

WORKDIR /zef

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install
#RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npm run migration:run
CMD ["npm", "run", "start:prod"]
EXPOSE 3000