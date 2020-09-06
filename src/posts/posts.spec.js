//GET route, check that it returns an array, status 200,
//POST, CHECK THAT YOU CAN SEND POST GET BACK 201
// GET by id /posts/:id
//PUT responds with 204
const knex = require("knex");
const app = require("../app");
const { makeUsersArray } = require("../users/users.fixtures");
const { makePostsArray } = require("./posts.fixtures");
const { expect } = require("chai");

describe("Posts endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE posts, users RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE posts, users RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/posts`, () => {
    context(`Given no posts `, () => {
      it(`responds with 200 and an array`, () => {
        return supertest(app).get("/api/posts").expect(200, []);
      });
    });

    context(`Given there are posts `, () => {
      const testPosts = makePostsArray();
      const testUsers = makeUsersArray();

      beforeEach("insert users", () => {
        return db.into("users").insert(testUsers);
      });
      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPosts);
      });

      it(`responds with 200 and test array from fixtures`, () => {
        return supertest(app)
          .get("/api/posts")
          .expect(200)
          .expect((res) => {
            expect(res.body[0].content).to.eql(testPosts[0].content);
          });
      });
    });
  });

  describe(`POST /api/posts`, () => {
    context(`Given a POST request`, () => {
      const testPosts = makePostsArray();
      const testUsers = makeUsersArray();

      beforeEach("insert users", () => {
        return db.into("users").insert(testUsers);
      });

      before("clean the table", () =>
        db.raw("TRUNCATE posts, users RESTART IDENTITY CASCADE")
      );

      afterEach("cleanup", () =>
        db.raw("TRUNCATE posts, users RESTART IDENTITY CASCADE")
      );

      it(`responds with 201 `, () => {
        const newPost = {
          user_id: 2,
          content: "new post test",
        };
        return supertest(app)
          .post("/api/posts")
          .send(newPost)
          .expect(201)
          .expect((res) => {
            expect(res.body.content).to.eql(newPost.content);
          });
      });
    });
  });

  describe(`GET /api/posts/:id`, () => {
    context(`Given a post with an id`, () => {
      const testPosts = makePostsArray();
      const testUsers = makeUsersArray();

      beforeEach("insert users", () => {
        return db.into("users").insert(testUsers);
      });
      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPosts);
      });

      it(`responds with 200 and specified post `, () => {
        const id = 2;
        const expectedPost = testPosts.filter((post) => post.user_id === 2);
        return supertest(app)
          .get(`/api/posts/${id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].content).to.eql(expectedPost[0].content);
          });
      });
    });
  });
});
