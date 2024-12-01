"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    // маршрут для получения карточек
    // https://content-api.wildberries.ru/content/v2/get/cards/list
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для получения карточек в корзине
    // https://content-api.wildberries.ru/content/v2/get/cards/trash
    return { root: true };
  });
};
