//test each route that it succeeds

//GET route, check that it returns an array, status 200,
//POST, CHECK THAT YOU CAN SEND POST GET BACK 201
//
const knex = require("knex");
const app = require("../src/app");

describe("Posts endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
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
});
