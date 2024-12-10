const { RabbitMq, Logger, FileHandler } = require("@laretto/raw-data-lib");
const apis = require("./apis");
require("dotenv").config();

class MainPackage {
  constructor() {
    this.folder = "./shared";
    const loggerInstance = new Logger();
    this.logger = loggerInstance.init({
      name: "api-fetcher",
      level: "debug",
    });
    this.queueName = "api-queue";
    this.fileHandler = new FileHandler(this.folder);
    this.rabbit = new RabbitMq({
      connectionString: "amqp://localhost",
      logger: this.logger,
    });
  }

  async init() {
    try {
      await this.rabbit.connect();
      await this.rabbit.initChannelForQueue(this.queueName, { prefetch: 1 });
      await this.rabbit.consumeMessages(this.queueName, this.processMessage);
    } catch (error) {
      console.error("Error in RabbitMQ flow:", error);
    }
  }

  async processMessage(message) {
    try {
      const payload = JSON.parse(message);
      const { repository, params, cronJobId } = payload;

      if (!repository || !apis[repository]) {
        throw new Error(`Нет реализации api для загрузки: ${repository}`);
      }

      const { startDate, endDate, url } = params;
      const instance = new apis[repository]({ logger, url });
      const result = await instance.start({
        startDate,
        endDate,
      });

      //TODO: реализовать батч сохранение потоком

      const link = await this.fileHandler.saveResultOnDisk(result);

      await this.sendToDb({
        link,
        repository,
        cronJobId,
      });
    } catch (err) {
      await this.processError();
    }
  }

  async sendToDb(body) {
    this.rabbit.sendMessage("db-queue", JSON.stringify(body));
  }

  async processError() {}

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
