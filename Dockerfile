FROM node:21.2.0
WORKDIR /authentication/
COPY package*.json ./
RUN ["npm","install"]
COPY . .
RUN npm run build && \
    npx prisma migrate && \
    npx prisma generate && \
    npm install -g @nestjs/cli

CMD ["node","dist/main.js"]
