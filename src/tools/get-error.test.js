"use strict";

const { test } = require("tap");
const { getError } = require("./get-error");

test("check getError with existed value", async (t) => {
  const errors = getError("test_key", { test_key: "test_value" }, {});
  t.equal(errors, "test_key is invalid.", "check getError");
});

test("check getError with not existed value", async (t) => {
  const errors = getError("test_key_not_exist", { test_key: "test_value" }, {});
  t.equal(errors, "test_key_not_exist is required.", "check getError");
});
