FROM node:22-alpine AS appbuild

WORKDIR /shared
COPY shared/package.json ./
RUN npm install
COPY shared/ ./

WORKDIR /src
COPY api-fetcher/package.json .
RUN npm install
COPY api-fetcher/ ./

FROM node:22-alpine
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ >/etc/timezone
WORKDIR /src
COPY --from=appbuild /src /src
COPY --from=appbuild /shared /shared
RUN npm i ../shared

ENTRYPOINT ["node", "index.js"]
