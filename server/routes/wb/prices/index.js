"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    // метод для получения цены товара
    // https://discounts-prices-api.wildberries.ru/api/v2/list/goods/filter
    return { root: true };
  });
};
