FROM node:latest
WORKDIR /app/auth
COPY . .

RUN npm install

CMD [ "npm","start" ]

EXPOSE 3002