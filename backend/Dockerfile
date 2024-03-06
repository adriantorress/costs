FROM node:latest

WORKDIR /costs/backend

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

#RUN chmod +x node_modules/.bin/ts-node-dev 
#RUN chmod +x node_modules/.bin/wait-for-it.sh

EXPOSE 5000

CMD ["yarn", "dev"]

