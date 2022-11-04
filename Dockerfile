FROM node:18.12-bullseye

WORKDIR /app

COPY . .

COPY ["package.json", "package-lock.json", "./"]

RUN npm install -g npm && \
    npm install


ENV PORT=3000
ENV DB_URL='mongodb://root:example@mongo:27017/'
ENV SESSION_SECRET='1234567890'

EXPOSE 3000

CMD ["npm", "start"]