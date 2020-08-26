const UsersService = {
  insertUser(knex) {
    return knex
      .insert({})
      .into("users")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = UsersService;
