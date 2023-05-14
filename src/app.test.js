"use strict";

const { test } = require("tap");
const build = require("./app");
const fs = require("fs");

const clearLogs = () => {
  fs.rmSync("./test/logs.json");
  fs.rmdirSync("./test/");
};

test('requests the "/" route', async (t) => {
  const app = build({
    logsFile: "./test/logs.json",
    valueDir: "./test/",
  });

  const response = await app.inject({
    method: "GET",
    url: "/",
  });
  t.equal(response.statusCode, 200, "returns a status code of 200");

  clearLogs();
});

test('requests the "/log" route', async (t) => {
  const app = build({
    logsFile: "./test/logs.json",
    valueDir: "./test/",
  });

  const response = await app.inject({
    method: "POST",
    url: "/log",
    payload: {
      dateOnServiceSide: 1,
      serviceName: "test_service",
      moduleName: "test_module",
      messageType: "info",
      message: "test_message",
    },
  });
  t.equal(response.statusCode, 200, "returns a status code of 200");

  clearLogs();
});

test('requests the "/log" route must regect by key', async (t) => {
  const app = build({
    logsFile: "./test/logs.json",
    valueDir: "./test/",
  });

  const response = await app.inject({
    method: "POST",
    url: "/log",
    payload: {
      serviceName: "test_service",
      moduleName: "test_module",
      messageType: "info",
      message: "test_message",
    },
  });
  t.equal(response.statusCode, 400, "returns a status code of 400");

  const body = JSON.parse(response.body);
  t.equal(body.length, 1, "returns a one error");
  t.equal(
    body[0],
    "Some keys are missing: dateOnServiceSide",
    "returns the one error: Some keys are missing: dateOnServiceSide"
  );
  clearLogs();
});
