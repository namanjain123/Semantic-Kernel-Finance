FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g serve

RUN npm install --save-dev

COPY . .

ENV NODE_ENV "development"

EXPOSE 3000

RUN npm run build

#CMD ["npm", "start"]

CMD ["serve", "-s", "build"]