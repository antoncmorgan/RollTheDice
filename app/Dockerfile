FROM node:lts-alpine

WORKDIR /app
COPY . .

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "serve", "--", "--port", "3000"]
