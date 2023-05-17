"use strict";

const fastify = require("fastify");
const LoggerController = require("./logger-controller");
const { validate } = require("./tools/validate");
const path = require("path");
const { validateJwtToken } = require("./tools/jwt");
const schema = require("./schemas/schema");

const saltRounds = 10;

const SECRET = "shhhhh";

const ServicesController = require("./service-controller");
const UsersController = require("./user-controller");

function build(opts) {
  const app = fastify(opts);

  const { logsFile, valueDir, serviciesFile } = opts;

  const loggerController = new LoggerController(logsFile, valueDir);
  const servicesController = new ServicesController(
    serviciesFile,
    valueDir,
    SECRET
  );
  const usersController = new UsersController(saltRounds, SECRET);

  app.register(require("@fastify/static"), {
    root: path.join(__dirname, "views"),
  });

  app.register((instance, opts, done) => {
    instance.get("/", function (req, reply) {
      reply.redirect("/panel");
    });

    instance.get("/login", function (req, reply) {
      reply.sendFile("login.html");
    });

    instance.post("/login", async (request, reply) => {
      return await usersController.validatePassword(request.body);
    });

    instance.get("/signup", function (req, reply) {
      reply.sendFile("signup.html");
    });

    instance.post("/signup", async (request, reply) => {
      return await usersController.add(request.body);
    });

    instance.get("/panel", function (req, reply) {
      reply.sendFile("panel.html");
    });

    done();
  });

  app.register((instance, opts, done) => {
    instance.addHook("preHandler", (request, reply, done) => {
      const token = request.headers.authorization;
      if (!token || token.includes("Bearer") === false) {
        reply.code(401);
        return "Unauthorized";
      }

      const tokenValue = token.split(" ")[1];

      const isValid = validateJwtToken(tokenValue, SECRET);
      if (!isValid) {
        reply.code(401);
        return "Unauthorized";
      }

      done();
    });

    instance.post("/get-new-jwt", async (request, reply) => {
      const username = validateJwtToken(
        request.headers.authorization.split(" ")[1],
        SECRET
      ).username;
      return servicesController.getNewJWT(username, request.body.serviceName);
    });

    instance.post("/add-new-service", async (request, reply) => {
      const username = validateJwtToken(
        request.headers.authorization.split(" ")[1],
        SECRET
      ).username;
      return servicesController.add(username, request.body.serviceName);
    });

    instance.get("/panel-data", async (request, reply) => {
      const username = validateJwtToken(
        request.headers.authorization.split(" ")[1],
        SECRET
      ).username;

      return {
        username,
        services: servicesController.get(username),
      };
    });

    instance.get("/logs", function (request, reply) {
      const username = validateJwtToken(
        request.headers.authorization.split(" ")[1],
        SECRET
      ).username;

      const page = (+request.query.page || 1) - 1;
      const limit = request.query.limit || 20;

      const allUserLogs = loggerController.logs.filter(
        (log) => log.username === username
      );

      return {
        [page + 0]: allUserLogs.slice((page - 1) * limit, page * limit),
        [page + 1]: allUserLogs.slice(page * limit, (page + 1) * limit),
        [page + 2]: allUserLogs.slice((page + 1) * limit, (page + 2) * limit),
      };
    });

    done();
  });

  app.register((instance, opts, done) => {
    instance.addHook("preHandler", (request, reply, done) => {
      const token = request.headers.authorization;
      if (!token || token.includes("Bearer") === false) {
        reply.code(401);
        return "Unauthorized";
      }

      const tokenValue = token.split(" ")[1];

      const isValid = validateJwtToken(tokenValue);
      if (!isValid) {
        reply.code(401);
        return "Unauthorized";
      }

      done();
    });

    instance.post("/log", async (request, reply) => {
      const errors = validate(request.body, schema);
      if (errors.length > 0) {
        reply.code(400);
        return errors;
      }

      loggerController.log(request.body);
      return "ok";
    });
    done();
  });

  return app;
}

module.exports = build;
