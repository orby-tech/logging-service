const jwt = require("jsonwebtoken");

const getJwtToken = (user, SECRET) => {
  return jwt.sign(user, SECRET);
};
const validateJwtToken = (token, SECRET) => {
  return jwt.verify(token, SECRET);
};

module.exports = {
  getJwtToken,
  validateJwtToken,
};
