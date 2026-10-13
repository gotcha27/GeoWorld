FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --include=optional
RUN npm install @rollup/rollup-linux-x64-gnu

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

