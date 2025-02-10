const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  await fastify.register(require("@fastify/redis"), {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PWD,
    port: process.env.REDIS_PORT,
  });
});
