const { RabbitMq } = require("@laretto/raw-data-lib");
const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  const { RABBIT_URL } = fastify.config;
  const queues = ["api-queue", "log-queue"];

  const onError = function (err) {
    fastify.log.error(`Произошла ошибка на стороне rabbitmq: ${err.message}`);
  };

  const amqp = new RabbitMq({
    connectionString: RABBIT_URL,
    logger: fastify.log,
    onError,
  });

  await amqp.connect();

  for (const queue of queues) {
    await amqp.initChannelForQueue(queue);
    fastify.log.info(`Создан канал для подключения к очереди: ${queue}`);
  }

  fastify.log.info("Подключение к RabbitMQ установлено");

  async function sendMessage(queue, message) {
    await amqp.sendMessage(queue, JSON.stringify(message));
  }

  fastify.addHook("onClose", async () => {
    await amqp.close();
  });

  fastify.decorate("rabbitmq", { sendMessage });
});
