const path = require("path");
const express = require("express");
//const xss = require("xss");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.route("/").post(jsonParser, (req, res, next) => {
  UsersService.insertUser(req.app.get("db"))
    .then((user) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(user);
    })
    .catch(next);
});

module.exports = usersRouter;
