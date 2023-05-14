const getNotExistedKeys = (object, schema) => {
  const schemaKeys = Object.keys(schema);
  const objectKeys = Object.keys(object);

  return schemaKeys.filter((key) => !objectKeys.includes(key));
};

module.exports = { getNotExistedKeys };
