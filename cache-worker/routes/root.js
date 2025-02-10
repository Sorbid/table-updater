"use strict";
const apis = require("../api");

const MARKETPLACES = ["wb", "ym", "ozon"];
const CACHE_EXPIRES = 12 * 60 * 60;

module.exports = async function (fastify, opts) {
  const { redis, log } = fastify;
  //TODO: сделать схему для проверок
  fastify.get("/:marketplace/:entity", async function (req, reply) {
    const { marketplace, entity } = req.params;
    if (!MARKETPLACES.includes(marketplace))
      return reply.code(404).send({
        message: "Маркетплейс не найден",
      });

    const cache = await redis.get(`${marketplace} ${entity}`);

    if (cache) return JSON.parse(cache);

    //TODO: вытащить ошибки ниже уровнем
    try {
      const instance = new apis[marketplace][entity]({
        marketplace,
        logger: log,
      });

      const data = await instance.start();

      await redis.set(`${marketplace} ${entity}`, JSON.stringify(data));
      await redis.expire(`${marketplace} ${entity}`, CACHE_EXPIRES);

      return data;
    } catch (err) {
      return reply.code(404).send({
        message: "Сущность не имплементирована",
      });
    }
  });
};
