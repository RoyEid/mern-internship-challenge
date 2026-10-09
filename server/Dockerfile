FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm@12.4.2

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . . 

EXPOSE 5000

CMD ["pnpm", "start"]