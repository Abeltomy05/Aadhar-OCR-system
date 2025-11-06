FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# build the TypeScript files into /dist
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]