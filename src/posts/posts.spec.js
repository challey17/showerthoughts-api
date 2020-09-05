//GET route, check that it returns an array, status 200,
//POST, CHECK THAT YOU CAN SEND POST GET BACK 201
// GET by id /posts/:id
//PUT responds with 204
const knex = require("knex");
const app = require("../app");

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
  });

  describe(`POST /api/posts`, () => {
    beforeEach("clean the table", () =>
      db.raw("TRUNCATE posts, users RESTART IDENTITY CASCADE")
    );
    const testPost = {
      user_id: 45,
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
