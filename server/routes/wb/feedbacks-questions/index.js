"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для получения списка отзывов
    // https://feedbacks-api.wildberries.ru/api/v1/feedbacks
    return { root: true };
  });
};
