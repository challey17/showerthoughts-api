// POST, check if you can send post, get back 201

const knex = require("knex");
const app = require("../app");

describe("users Endpoints", function () {
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
    db.raw("TRUNCATE users RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () => db.raw("TRUNCATE users RESTART IDENTITY CASCADE"));

  describe(`POST /api/users`, () => {
    context(`Given a POST request`, () => {
      it(`responds with 201 and creates user`, () => {
        return supertest(app).post("/api/users").expect(201);
      });
    });
  });
});
