const { RabbitMq, Logger, FileHandler } = require("@laretto/raw-data-lib");
const Db = require("./utils/db");

const SHARED_FOLDER = "./shared";
const LOG_QUEUE = "log-queue";
const APP_NAME = "db-worker";
const LOGGER_LEVEL = "debug";
const RABBIT_URL = "amqp://localhost";

class MainPackage {
  constructor() {
    this.folder = SHARED_FOLDER;
    this.fileHandler = new FileHandler(this.folder);

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
    this.initDb();
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

  initDb() {
    const dbInstance = new Db({ logger: this.logger });
    this.db = dbInstance.init();
  }

  async processMessage(message) {
    const payload = JSON.parse(message);
    const { cronJobId, repository, isError, message } = payload;

    try {
      await this.db[repository].insert(result);
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
