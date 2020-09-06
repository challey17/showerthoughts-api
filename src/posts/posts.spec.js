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

  describe.only(`GET /api/posts`, () => {
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
        return supertest(app).get("/api/posts").expect(200, testPosts);
      });
    });
  });

  describe(`POST /api/posts`, () => {
    const testUser = {
      id: 3,
    };
    const testPost = {
      user_id: 3,
      content: "blah blah",
    };
    context(`Given a POST request`, () => {
      it(`responds with 201 `, () => {
        return supertest(app)
          .post("/api/posts")
          .send(testPost)
          .expect(201)
          .expect((res) => {
            expect(res.user_id).to.eql(testPost.user_id);
            expect(res.content).to.eql(testPost.content);
            expect(res.headers.location).to.eql(
              `/api/posts/${res.body.user_id}`
            );
          });
      });
    });
  });
});
