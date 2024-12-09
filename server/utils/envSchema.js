module.exports = {
  type: "object",
  required: [
    "RABBIT_URL",
    "NODE_ENV",
    // "DB_HOST",
    // "DB_USER",
    // "DB_PASS",
    // "DB_PORT",
    // "DB_BASE",
  ],
  properties: {
    RABBIT_URL: {
      type: "string",
    },
    SCHEMA_NAME: {
      type: "string",
    },
    PORT: {
      type: "integer",
      default: 3000,
    },
    DB_HOST: {
      type: "string",
    },
    DB_USER: {
      type: "string",
    },
    DB_PASS: {
      type: "string",
    },
    DB_PORT: {
      type: "integer",
    },
    DB_BASE: {
      type: "string",
    },
    SENTRY_DSN: {
      type: "string",
    },
    NODE_ENV: {
      type: "string",
    },
  },
};
