const bcrypt = require("bcrypt");

const { getJwtToken } = require("./tools/jwt");

class UsersController {
  saltRounds;
  SECRET;
  constructor(saltRounds, SECRET) {
    this.SECRET = SECRET;
    this.saltRounds = saltRounds;
    this.users = [];
    this.add({
      username: "admin",
      password: "admin",
    });

    this.add({
      username: "demo",
      password: "demo",
    });
  }

  async add(user) {
    const hash = await bcrypt.hash(user.password, this.saltRounds);

    this.users.push({
      username: user.username,
      password: hash,
    });

    return this.validatePassword(user);
  }

  get(id) {
    return this.users.find((user) => user.id === id);
  }

  async validatePassword(user) {
    const userFromDb = this.users.find((u) => u.username === user.username);
    if (!userFromDb) {
      return {
        status: "error",
        message: "Wrong password",
      };
    }

    const result = await bcrypt.compare(user.password, userFromDb.password);

    if (!result) {
      return {
        status: "error",
        message: "Wrong password",
      };
    }

    return {
      status: "success",
      token: getJwtToken(user, this.SECRET),
    };
  }
}

module.exports = UsersController;
