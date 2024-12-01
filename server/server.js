const Fastify = require("fastify");
const fastifyEnv = require("@fastify/env");
const appService = require("./app.js");
const closeWithGrace = require("close-with-grace");

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

app
  .register(fastifyEnv, {
    confKey: "config",
    schema: envSchema,
  })
  .ready((err) => {
    if (err) app.log.error(err);
    app.register(appService, {
      queues: ["db-queue", "log-queue"],
      rabbitUrl: app.config.RABBIT_URL,
    });
    app.listen({ port: app.config.PORT || 3000, host: "0.0.0.0" }, (err) => {
      if (err) {
        app.log.error(err);
        throw new Error("Exit with code 1");
      }
    });
  });

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace(
  { delay: app.config.FASTIFY_CLOSE_GRACE_DELAY || 500 },
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook("onClose", async (instance, done) => {
  closeListeners.uninstall();
  done();
});
