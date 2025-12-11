FROM node:20

WORKDIR /app

COPY package.json ./
RUN npm install

# Copia el resto del código
COPY . .

RUN npx prisma generate

RUN mkdir -p uploads
EXPOSE 3000

CMD ["npm", "start"]
