"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    // коэффициенты приёмки для конкретных складов на ближайшие 14 дней
    // https://supplies-api.wildberries.ru/api/v1/acceptance/coefficients
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // коэффициенты приёмки для конкретных складов на ближайшие 14 дней
    // https://supplies-api.wildberries.ru/api/v1/warehouses
    return { root: true };
  });
};
