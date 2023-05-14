const getError = (key, object, schema) => {
  if (object[key] === undefined) {
    return key + " is required.";
  }
  return key + " is invalid.";
};

module.exports = { getError };
