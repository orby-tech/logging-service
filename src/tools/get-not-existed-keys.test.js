"use strict";

const { test } = require("tap");
const { getNotExistedKeys } = require("./get-not-existed-keys");

test("check getNotExistedKeys", async (t) => {
  const notExisted = getNotExistedKeys(
    { test_key: "test_value" },
    { test_key: "test_value" }
  );
  t.equal(notExisted.length, 0, "check getNotExistedKeys");
});
