
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("quotes"),
    knex.schema.createTable("quotes", table => {
      table.uuid("id").primary();
      table.uuid("user_id");
      table.text("text");
      table.string("author");
      table.string("source");
      table.string("createdAt");
      table.string("modifiedAt");
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("quotes"),
  ]);
};
