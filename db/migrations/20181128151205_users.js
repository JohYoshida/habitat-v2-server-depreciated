
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("users"),
    knex.schema.createTable("users", table => {
      table.uuid("id").primary();
      table.string("email");
      table.string("password");
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("users"),
  ]);
};
