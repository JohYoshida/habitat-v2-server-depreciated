
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("tags"),
    knex.schema.createTable("tags", table => {
      table.uuid("id").primary();
      table.string("tag");
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("tags"),
  ]);
};
