const { RabbitMq, Logger } = require("@laretto/raw-data-lib");
const { insertIntoLog } = require("./utils/db");
const { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_BASE } = process.env;

const LOG_QUEUE = "log-queue";
const APP_NAME = "log-worker";
const LOGGER_LEVEL = "debug";
const RABBIT_URL = "amqp://localhost";

class MainPackage {
  constructor() {
    const loggerInstance = new Logger();
    this.logger = loggerInstance.init({
      name: APP_NAME,
      level: LOGGER_LEVEL,
    });
    this.rabbit = new RabbitMq({
      connectionString: RABBIT_URL,
      logger: this.logger,
    });
  }

  async init() {
    await this.initRabbit();
  }

  async initRabbit() {
    try {
      await this.rabbit.connect();
      const queueName = LOG_QUEUE;

      await this.rabbit.consumeMessages(queueName, (message) => {
        this.processMessage(message);
      });
    } catch (error) {
      console.error("Error in RabbitMQ flow:", error);
    }
  }

  async processMessage(message) {
    const payload = JSON.parse(message);
    const { cronJobId, isError, errMessage, updDate } = payload;

    try {
      await insertIntoLog(
        { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_BASE },
        { cronJobId, isError, errMessage, updDate, logger: this.logger }
      );
    } catch (err) {
      const message = `Ошибка при обработке сообщения: ${err.message};
      ${JSON.stringify(payload)}`;

      this.logger.error(message);
      throw new Error(message);
    }
  }

  async cleanup() {
    await this.rabbit.close();
  }
}

const main = new MainPackage();

main.init();

process.on("SIGINT", async () => {
  await main.cleanup();
  process.exit(0);
});
