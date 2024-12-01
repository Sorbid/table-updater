"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    // маршрут для поставок
    // https://statistics-api.wildberries.ru/api/v1/supplier/incomes
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для получения остатков на складах
    // https://statistics-api.wildberries.ru/api/v1/supplier/stocks
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для заказов
    // https://statistics-api.wildberries.ru/api/v1/supplier/orders
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для продаж и возвратов
    // https://statistics-api.wildberries.ru/api/v1/supplier/sales
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для фин отчета
    // https://statistics-api.wildberries.ru/api/v5/supplier/reportDetailByPeriod
    return { root: true };
  });
};
