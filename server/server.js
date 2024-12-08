const Fastify = require("fastify");
const fastifyEnv = require("@fastify/env");
const appService = require("./app");
const closeWithGrace = require("close-with-grace");
const envSchema = require("./utils/envSchema");

const app = Fastify({
  logger: true,
});

app
  .register(fastifyEnv, {
    confKey: "config",
    schema: envSchema,
  })
  .ready((err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    initServer(err);
  });

async function initServer() {
  app.register(appService);
  app.listen({ port: app.config.PORT, host: "0.0.0.0" }, (err) => {
    if (err) {
      app.log.error(err);
      throw new Error("Exit with code 1");
    }
  });
}

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
