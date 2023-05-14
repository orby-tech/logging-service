"use strict";

const fastify = require("fastify");
const LoggerController = require("./logger-controller");
const { validate } = require("./tools/validate");


const schema = require("./schemas/schema");

function build(opts) {
  const app = fastify(opts);

  const { logsFile, valueDir } = opts;

  const loggerController = new LoggerController(logsFile, valueDir);

  app.get("/", async (request, reply) => {
    return loggerController.logs;
  });

  app.post("/log", async (request, reply) => {
    const errors = validate(request.body, schema);
    if (errors.length > 0) {
      reply.code(400);
      return errors;
    }

    loggerController.log(request.body);
    return "ok";
  });

  return app;
}

module.exports = build;
