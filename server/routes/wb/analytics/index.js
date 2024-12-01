"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    // маршрут для аналитических отчетов
    // https://seller-analytics-api.wildberries.ru/api/v2/nm-report/detail
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для платного хранения
    // https://seller-analytics-api.wildberries.ru/api/v1/paid_storage
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для платной приемки
    // https://seller-analytics-api.wildberries.ru/api/v1/analytics/acceptance-report
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для рекламных кампаний
    // https://advert-api.wildberries.ru/adv/v1/promotion/count
    return { root: true };
  });

  fastify.get("/", async function (request, reply) {
    // маршрут для статистики рекламных кампаний
    // https://advert-api.wildberries.ru/adv/v2/fullstats
    return { root: true };
  });
};
