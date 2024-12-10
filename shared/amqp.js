const amqp = require("amqplib");

class RabbitMq {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.connectionString);
      this.channel = await this.connection.createChannel();
      this.channel.prefetch(1);
      console.log("Connected to RabbitMQ");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

  async createQueue(queueName) {
    try {
      await this.channel.assertQueue(queueName, { durable: true });
      console.log(`Queue "${queueName}" created or already exists.`);
    } catch (error) {
      console.error("Error creating queue:", error);
      throw error;
    }
  }

  async sendMessage(queueName, message) {
    try {
      await this.createQueue(queueName);
      this.channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
      console.log(`Message sent to queue "${queueName}": ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async consumeMessages(queueName, onMessage) {
    try {
      await this.channel.consume(queueName, async (msg) => {
        if (msg !== null) {
          console.log(
            `Received message from queue "${queueName}": ${msg.content.toString()}`
          );
          await onMessage(msg.content.toString());
          this.channel.ack(msg);
        }
      });
      console.log(`Started consuming messages from queue "${queueName}".`);
    } catch (error) {
      console.error("Error consuming messages:", error);
      throw error;
    }
  }

  async close() {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log("Connection to RabbitMQ closed.");
    } catch (error) {
      console.error("Error closing connection:", error);
      throw error;
    }
  }
}

module.exports = RabbitMq;
