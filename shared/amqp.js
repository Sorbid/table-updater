const amqp = require("amqplib");

class RabbitMq {
  constructor({ connectionString, logger, onClose, onError }) {
    this.checkArgs({ connectionString, logger, onClose, onError });
    this.connectionString = connectionString;
    this.logger = logger;
    this.connection = null;
    this.channel = null;
    this.onClose = onClose;
    this.onError = onError;
  }

  checkArgs({ connectionString, logger, onClose, onError }) {
    if (typeof connectionString !== "string") {
      throw new Error("Строка подключения для Rabbitmq не корректна");
    }

    if (!logger.info || !logger.debug || !logger.error) {
      throw new Error("Logger не инициализирован");
    }

    if (typeof onClose !== "function") {
      throw new Error("onClose не является функцией");
    }

    if (typeof onError !== "function") {
      throw new Error("onError не является функцией");
    }
  }

  setupHandlers() {
    this.connection.on("close", this.onClose);
    this.connection.on("error", this.onError);
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.connectionString);
      this.logger.info("Connected to RabbitMQ");
      this.setupHandlers();
    } catch (error) {
      this.logger.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

  async initChannelForQueue(queueName, opts) {
    if (this.channel[queueName])
      throw new Error(`Канал ${queueName} уже инициализирован`);

    this.channel[queueName] = await this.connection.createChannel();

    if (opts.prefetch) this.channel[queueName].prefetch(opts.prefetch);

    this.logger.info(
      `Канал для ${queueName} инициализирован: ${JSON.stringify(opts)}`
    );
  }

  async createQueue(queueName) {
    try {
      if (!this.channel[queueName]) this.initChannelForQueue(queueName, {});

      await this.channel[queueName].assertQueue(queueName, { durable: true });

      this.logger.info(`Queue "${queueName}" created or already exists.`);
    } catch (error) {
      this.logger.error("Error creating queue:", error);
      throw error;
    }
  }

  async sendMessage(queueName, message) {
    try {
      await this.createQueue(queueName);
      this.channel[queueName].sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
      this.logger.debug(`Message sent to queue "${queueName}": ${message}`);
    } catch (error) {
      this.logger.error("Error sending message:", error);
      throw error;
    }
  }

  async consumeMessages(queueName, onMessage) {
    try {
      await this.createQueue(queueName);

      await this.channel[queueName].consume(queueName, async (msg) => {
        if (msg === null)
          throw new Error(`Пустое сообщение в очереди ${queueName}`);
        this.logger.debug(
          `Received message from queue "${queueName}": ${msg.content.toString()}`
        );
        await onMessage(msg.content.toString());
        this.channel.ack(msg);
      });
      this.logger.info(`Started consuming messages from queue "${queueName}".`);
    } catch (error) {
      this.logger.error("Error consuming messages:", error);
      throw error;
    }
  }

  async close() {
    try {
      for (const channel of this.channel) {
        channel.close();
      }
      await this.connection.close();
      this.logger.info("Connection to RabbitMQ closed.");
    } catch (error) {
      this.logger.error("Error closing connection:", error);
      throw error;
    }
  }
}

module.exports = RabbitMq;
