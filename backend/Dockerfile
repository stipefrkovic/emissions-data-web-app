FROM node:20.10.0
WORKDIR /usr/src/app

ENV PORT=80
ENV HOST=0.0.0.0

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "dev"]