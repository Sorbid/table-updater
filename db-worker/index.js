const RabbitMQ = require("./utils/amqp");
const { db } = require("./db");
const { FileHandler, checkFolder } = require("./utils/file");
require("dotenv").config();

class MainPackage {
  constructor() {
    this.folder = "./shared";
    checkFolder(this.folder);
  }

  async init() {
    this.rabbit = new RabbitMQ(process.env.RABBIT_URL);
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
    const fileHandler = new FileHandler(this.folder);
    try {
      const payload = JSON.parse(message);
      const { type, link, updTableId } = payload;

      if (!type || !db[type]) {
        throw new Error(`Нет реализации db для обработки: ${type}`);
      }

      if (!link) {
        throw new Error("Нет ссылки для файла");
      }

      const result = await fileHandler.getFile(link);

      await db[type].insert(result);

      await sendToLog({ test: "check" });
    } catch (err) {
      await processError();
    } finally {
      fileHandler.unlinkFile();
    }
  }

  async sendToLog(body) {
    this.rabbit.sendMessage("log-queue", body);
  }

  async processError() {}
}

const main = new MainPackage();

main.init();
