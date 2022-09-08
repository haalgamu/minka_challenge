FROM node:16.17.0-alpine3.16

WORKDIR /zef

COPY ./package.json ./
COPY ./package-lock.json ./

COPY . .

RUN npm install
#RUN npm ci --only=production
RUN npm run build
CMD ["npm", "run", "start:prod"]
EXPOSE 3000