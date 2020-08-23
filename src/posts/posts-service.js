// C - .post() -> body -> user_id,content
// R - .get() -> gets all posts for today
// R - .get() -> gets all posts for a user

//how can i get posts just for todays' date?
//https://stackoverflow.com/questions/36013605/how-to-use-postgres-date-with-knex-js

const PostsService = {
  insertPost(knex, newPost) {
    return knex
      .insert(newPost)
      .into("posts")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, user_id) {
    return knex.from("posts").select("*").where("user_id", user_id).first();
  },
};

module.exports = PostsService;
