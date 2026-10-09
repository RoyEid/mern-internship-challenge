FROM node:24-alpine AS build

WORKDIR /app

RUN npm install -g pnpm@12.4.2

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . . 

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]