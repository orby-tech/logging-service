"use strict";

const { test } = require("tap");
const { validate } = require("./validate");
const schema = require("../schemas/schema");

test("validate json by shcema", async (t) => {
  const errors = validate(
    {
      dateOnServiceSide: 1,
      serviceName: "test_service",
      moduleName: "test_module",
      messageType: "info",
      message: "test_message",
    },
    schema
  );
  t.equal(errors.length, 0, "validate correct simplest object by schema");
});

test("validate json by shcema with extra key", async (t) => {
  const errors = validate(
    {
      dateOnServiceSide: 1,
      serviceName: "test_service",
      moduleName: "test_module",
      messageType: "info",
      message: "test_message",
      extraKey: "extra_value",
    },
    schema
  );
  t.equal(errors.length, 0, "validate correct simplest object by schema");
});

test("validate json by shcema with wrong validator in schema", async (t) => {
  t.throws(
    () =>
      validate(
        {
          dateOnServiceSide: 1,
          serviceName: "test_service",
          moduleName: "test_module",
          messageType: "info",
          message: "test_message",
          extraKey: "extra_value",
        },
        { ...schema, extraKey: true }
      ),
    {},
    "validate correct simplest object by schema"
  );
});
