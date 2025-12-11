FROM node:20

WORKDIR /app

# Copia package.json e instala dependencias
COPY package*.json ./

RUN npm install

# Copia el resto del código
COPY . .

# NO ejecutamos `npx prisma generate` aquí (lo hacemos en runtime,
# con DATABASE_URL disponible desde docker-compose).
CMD ["npm", "start"]
