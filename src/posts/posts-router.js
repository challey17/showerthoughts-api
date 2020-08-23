const path = require("path");
const express = require("express");
const PostsService = require("./posts-service");

const postsRouter = express.Router();
const jsonParser = express.json();

const serializePost = (post) => ({
  id: post.id,
  user_id: post.user_id,
  content: post.content,
  voters: post.voters,
});

postsRouter.route("/").post(jsonParser, (req, res, next) => {
  const { user_id, content } = req.body;
  const newPost = { user_id, content };

  for (const [key, value] of Object.entries(newPost))
    if (value == null)
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });
  newPost.content = content;
  newPost.id = res.id;
  newPost.created = res.created;
  newPost.voters = res.voters; // should this be an empty string instead of res.voters? res is null

  PostsService.insertPost(req.app.get("db"), newPost)
    .then((post) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${post.id}`))
        .json(serializePost(post));
    })
    .catch(next);
});

// in postman http://localhost:8000/api/posts/4 works fine
// but can't use with query params ? get errors
postsRouter
  .route("/:user_id")
  .all((req, res, next) => {
    PostsService.getById(req.app.get("db"), req.params.user_id)
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            error: { message: `user doesn't exist` },
          });
        }
        res.post = post;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializePost(res.post));
  });

module.exports = postsRouter;
