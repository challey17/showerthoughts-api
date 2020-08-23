const path = require("path");
const express = require("express");
const xss = require("xss");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  created: user.created,
});

usersRouter.route("/").post(jsonParser, (req, res, next) => {
  const { id, created } = req.body;
  const newUser = { id, created };

  for (const [key, value] of Object.entries(newUser)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });
    }
  }

  newUser.id = nickname;
  newUser.created = password;

  UsersService.insertUser(req.app.get("db"), newUser)
    .then((user) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(serializeUser(user));
    })
    .catch(next);
});
