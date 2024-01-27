FROM node:21-slim AS base

RUN npm i -g pnpm

COPY . /app
WORKDIR /app

RUN pnpm i --prod

RUN pnpm run build

ENV ORIGIN="0.0.0.0:3000"

CMD ["node", "-r", "dotenv/config", "build"]

