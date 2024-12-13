const { RabbitMq, Logger, FileHandler } = require("@laretto/raw-data-lib");
const Db = require("./utils/db");

const SHARED_FOLDER = "./shared";
const DB_QUEUE = "db-queue";
const LOG_QUEUE = "log-queue";

class MainPackage {
  constructor() {
    this.folder = SHARED_FOLDER;
    this.fileHandler = new FileHandler(this.folder);

    const loggerInstance = new Logger();
    this.logger = loggerInstance.init({
      name: "db-worker",
      level: "debug",
    });
    this.rabbit = new RabbitMq({
      connectionString: "amqp://localhost",
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
      const queueName = DB_QUEUE;

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
    const { repository, link, cronJobId, updDate } = payload;

    try {
      if (!repository || !this.db[repository]) {
        throw new Error(`Нет реализации db для обработки: ${repository}`);
      }

      if (!link) {
        throw new Error("Нет ссылки для файла");
      }
      //TODO: Реализовать батч вставку потоком

      const result = await this.fileHandler.getFile(link);

      await this.db[repository].insert(result);

      await this.sendToLog({
        cronJobId,
        updDate,
        isError: false,
        errMessage: null,
      });
      this.fileHandler.unlinkFile(link);
    } catch (err) {
      await this.processError({ updDate, cronJobId, err, isError: true });
      const message = "Ошибка при обработке сообщения: " + err.message;
      this.logger.error(message);
      // throw new Error(message);
    }
  }

  async sendToLog(body) {
    await this.rabbit.sendMessage(LOG_QUEUE, JSON.stringify(body));
  }

  async processError({ updDate, cronJobId, err, isError }) {
    await this.sendToLog({
      updDate,
      cronJobId,
      errMessage: err.message,
      isError,
    });
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
