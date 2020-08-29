require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const usersRouter = require("./users/users-router");
const postsRouter = require("./posts/posts-router");

const app = express();
//set up env variables for local and heroku
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/users", usersRouter);
// /api/users
/* CRUD
 * C - .post() -> body: {} -> res.status(201).json({id:5})
 * R - .get() -> N/A
 * U - N/A
 * D - N/A
 */

app.use("/api/posts", postsRouter);
// /api/posts
/* CRUD
 * C - .post() -> body -> user_id,content
 * R - .get() -> gets all posts for today
 * R - .get() -> gets all posts for a user
 * U - N/A
 * D - N/A
 */

// ERROR HANDLING: SHOW DETAILED ERRORS IN DEVELOPMENT,
// NON DETAILED MESSAGES IN PRODUCTION FOR SECURITY
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { message: error.message, error };
  }
  console.error(error);
  res.status(500).json(response);
});

module.exports = app;
