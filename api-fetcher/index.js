const RabbitMQ = require("./utils/amqp");
const apis = require("./apis");
const logger = require("./utils/logger");
const { FileHandler } = require("./utils/file");
require("dotenv").config();

class MainPackage {
  constructor() {
    this.folder = "./shared";
    this.fileHandler = new FileHandler(this.folder);
  }

  async init() {
    this.rabbit = new RabbitMQ("amqp://localhost");
    try {
      await this.rabbit.connect();
      const queueName = "api-queue";

      await this.rabbit.consumeMessages(queueName, (message) => {
        this.processMessage(message);
      });
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
}

const main = new MainPackage();

main.init();
