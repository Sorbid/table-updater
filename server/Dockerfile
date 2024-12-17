FROM node:20-alpine AS appbuild
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-alpine
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ >/etc/timezone
WORKDIR /src
COPY --from=appbuild /src .
ENTRYPOINT ["node", "server.js"]
