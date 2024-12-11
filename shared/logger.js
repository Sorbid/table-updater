const pino = require("pino");

class Logger {
  constructor() {
    this.logger = undefined;
  }

  init(opts) {
    if (!this.logger)
      this.logger = pino({
        ...opts,
        name: opts?.name,
        level: opts?.level || "info",
        base: undefined,
        timestamp: pino.stdTimeFunctions.isoTime,
      });

    return this.logger;
  }
}

module.exports = Logger;
