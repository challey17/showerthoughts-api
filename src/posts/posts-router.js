const path = require("path");
const express = require("express");
const PostsService = require("./posts-service");
const xss = require("xss");

const postsRouter = express.Router();
const jsonParser = express.json();

const serializePost = (post) => ({
  id: post.id,
  user_id: post.user_id,
  content: xss(post.content),
  voters: post.voters || "",
  created: post.created,
});

postsRouter
  .route("/")
  .get((req, res) => {
    PostsService.getTodaysPosts(req.app.get("db")).then((posts) =>
      res.json(posts.map(serializePost))
    );
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id, content } = req.body;
    const newPost = { user_id, content };

    for (const [key, value] of Object.entries(newPost))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

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
  .route("/:id")
  .get((req, res, next) => {
    // will use req.params.id as a user id
    PostsService.getByUser(req.app.get("db"), req.params.id)
      .then((posts) => {
        if (!posts) {
          return res.status(404).json({
            error: { message: `user doesn't exist` },
          });
        }
        res.json(posts.map(serializePost));
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    // will use req.params.id as a post id
    PostsService.updatePost(req.app.get("db"), req.params.id, req.params.body)
      .then(() => res.send(204))
      .catch(next);
  });

module.exports = postsRouter;
