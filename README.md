# Showerthoughts API

[Live Link](https://showerthoughts-client.challey17.vercel.app/)

App for sharing "shower thoughts" - brief observations about life that are often humorous. Users are given an Id that is stored in their device local storage which allows for user-specific data without a login/password.

[Client Repo](https://github.com/challey17/showerthoughts-client.git)

## API

- /api/users

  - POST - creates a new user(userId saved in local storage on user's device on front end)

- /api/posts

  - GET - gets all posts from all users
  - POST - creates a new post
  - PUT - updates vote count on post

- api/posts/:id
  - GET - gets posts based on userId

### Technology

Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, PostgresSQL
