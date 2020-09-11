# Showerthoughts API

[Live Link](https://showerthoughts.vercelapp.com)

App for sharing "shower thoughts" - brief observations about life that are often humorous. Users are given an Id that is stored in their device local storage which allows for user-specific data without a login/password.

[Client Repo](https://showerthoughts.vercelapp.com)

## API

- /api/users - POST - creates a new user(userId saved in local storage on user's device on front end)

- /api/posts

  - GET - gets all posts from all users
  - POST - creates a new post
  - PUT - updates vote count on post

- api/posts/:id
  - GET - gets posts based on userId
