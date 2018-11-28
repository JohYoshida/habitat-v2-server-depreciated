
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("habits"),
    knex.schema.createTable("habits", table => {
      table.uuid("id").primary();
      table.uuid("user_id");
      table.string("name");
      table.string("color");
      table.string("createdAt");
      table.string("modifiedAt");
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("habits"),
  ]);
};
