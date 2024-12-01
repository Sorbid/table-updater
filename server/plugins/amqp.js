const amqplib = require("amqplib");
const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  const { queues, rabbitUrl } = opts;

  let connection;
  const channels = {};
  let maxTries = 5;
  let reconnectTries = 0;

  function setupRabbitHandlers() {
    connection.on("close", async () => {
      if (reconnectTries >= maxTries) {
        fastify.log.fatal(
          "Максимальное количество переподключений, отключение сервера"
        );
        fastify.close();
      }
      fastify.log.warn("Попытка реконнекта...");
      reconnectTries++;
      for (const queueName in channels) {
        if (channels[queueName]) await channels[queueName].close();
      }
      if (connection) await connection.close();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await connect();
    });

    connection.on("error", async (err) => {
      fastify.log.error(`Произошла ошибка на стороне rabbitmq: ${err.message}`);
    });
  }

  async function connect() {
    try {
      connection = await amqplib.connect(url);
      for (const queue of queues) {
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        channels[queue] = channel;
        fastify.log.info(`Создан канал для подключения к очереди: ${queue}`);
      }
      fastify.log.info("Подключение к RabbitMQ установлено");
      reconnectTries = 0;

      setupRabbitHandlers();
    } catch (err) {
      fastify.log.error(
        `Ошибка при открытии соединения с RabbitMQ: ${err.message}`
      );
      throw err;
    }
  }

  async function sendMessage(queue, message) {
    const channel = channel[queue];
    if (!channel) throw new Error(`Канал не инициилизирован: ${queue}`);
    await channel.sendToQueue(queue, Buffer.from(message));
    fastify.log.debug(`Сообщение передано в ${queue}: ${message}`);
  }

  async function closeConnection() {
    try {
      for (const queueName in channels) {
        if (channels[queueName]) await channels[queueName].close();
      }
      if (connection) await connection.close();
      fastify.log.info("Подключение к RabbitMQ закрыто");
    } catch (err) {
      fastify.log.error(
        `Ошибка при закрытии соединения с RabbitMQ: ${err.message}`
      );
    }
  }

  fastify.addHook("onClose", async () => {
    await closeConnection();
  });

  await connect();

  fastify.decorate("rabbitmq", { sendMessage });
});
