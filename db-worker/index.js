const RabbitMQ = require("../shared/amqp");
const { db } = require("./utils/db");
const { FileHandler, checkFolder } = require("../shared/fileHandler");
const logger = require("./utils/logger");

require("dotenv").config();

class MainPackage {
  constructor() {
    this.folder = "./shared";
    checkFolder(this.folder);
    this.logger = logger;
  }

  async init() {
    this.rabbit = new RabbitMQ("amqp://localhost", this.logger);
    try {
      await this.rabbit.connect();
      const queueName = "db-queue";

      await this.rabbit.consumeMessages(queueName, (message) => {
        this.processMessage(message);
      });
    } catch (error) {
      console.error("Error in RabbitMQ flow:", error);
    }
  }

  async processMessage(message) {
    const fileHandler = new FileHandler(this.folder);
    const payload = JSON.parse(message);
    const { repository, link, cronJobId } = payload;

    try {
      if (!repository || !db[repository]) {
        throw new Error(`Нет реализации db для обработки: ${repository}`);
      }

      if (!link) {
        throw new Error("Нет ссылки для файла");
      }
      //TODO: Реализовать батч вставку потоком

      const result = await fileHandler.getFile(link);

      await db[repository].insert(result);

      this.sendToLog({ cronJobId, repository, status: 0 });
      fileHandler.unlinkFile();
    } catch (err) {
      await processError(repository);
    }
  }

  sendToLog(body) {
    this.rabbit.sendMessage("log-queue", JSON.stringify(body));
  }

  async processError() {}
}

const main = new MainPackage();

main.init();
