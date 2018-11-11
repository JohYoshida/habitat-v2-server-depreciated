
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("users", table => {
      table.uuid("id").primary();
      table.string("username");
      table.string("email");
      table.string("password");
    }),
    knex.schema.createTable("habits", table => {
      table.uuid("id").primary();
      table.string("user");
      table.string("name");
      table.string("createdAt");
      table.string("modifiedAt");
    }),
  ]);

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("users"),
    knex.schema.dropTableIfExists("habits"),
  ]);
};
