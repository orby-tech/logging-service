const { getNotExistedKeys } = require("./get-not-existed-keys");
const { getError } = require("./get-error");

const validate = (object, schema) => {
  const notExistedKeys = getNotExistedKeys(object, schema);

  if (notExistedKeys.length) {
    return [`Some keys are missing: ${notExistedKeys.join(", ")}`];
  }

  const objectKeys = Object.keys(object);

  const incorrectKeys = objectKeys.filter((key) => {
    const validator = schema[key];
    if (!validator) {
      return false;
    }

    if (typeof validator !== "function") {
      throw new Error("Validator must be a function. On key: " + key);
    }

    return !validator(object[key]);
  });

  const errors = incorrectKeys.map((key) => getError(key, object, schema));

  return errors;
};

module.exports = {
  validate,
  getError,
};
