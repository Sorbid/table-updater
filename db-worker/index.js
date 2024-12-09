const RabbitMQ = require("./utils/amqp");
const { db } = require("./utils/db");
const { FileHandler, checkFolder } = require("./utils/file");
require("dotenv").config();

class MainPackage {
  constructor() {
    this.folder = "./shared";
    checkFolder(this.folder);
  }

  async init() {
    this.rabbit = new RabbitMQ("amqp://localhost");
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
    try {
      const payload = JSON.parse(message);
      const { repository, link, cronJobId } = payload;

      if (!repository || !db[repository]) {
        throw new Error(`Нет реализации db для обработки: ${repository}`);
      }

      if (!link) {
        throw new Error("Нет ссылки для файла");
      }

      const result = fileHandler.getFile(link);

      await db[repository].insert(result);

      await sendToLog({ test: "check" });
    } catch (err) {
      await processError();
    } finally {
      fileHandler.unlinkFile();
    }
  }

  async sendToLog(body) {
    this.rabbit.sendMessage("log-queue", JSON.stringify(body));
  }

  async processError() {}
}

const main = new MainPackage();

main.init();
