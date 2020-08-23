const path = require("path");
const express = require("express");
//const xss = require("xss");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

// DO I NEED XSS?
const serializeUser = (user) => ({
  id: user.id,
  created: user.created,
});

usersRouter.route("/").post(jsonParser, (req, res, next) => {
  const newUser = {};

  newUser.id = res.id;
  newUser.created = res.created;

  UsersService.insertUser(req.app.get("db"), newUser)
    .then((user) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(serializeUser(user));
    })
    .catch(next);
});

module.exports = usersRouter;
