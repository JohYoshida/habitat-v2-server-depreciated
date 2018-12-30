
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("quote_tags"),
    knex.schema.createTable("quote_tags", table => {
      table.uuid("id").primary();
      table.uuid("quote_id");
      table.uuid("tag_id");
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("quote_tags"),
  ]);
};
