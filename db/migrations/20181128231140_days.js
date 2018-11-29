
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("days"),
    knex.schema.createTable("days", table => {
      table.uuid("id").primary();
      table.uuid("habit_id");
      table.integer("day");
      table.string("month");
      table.integer("year");
      table.string("value");
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("days"),
  ]);
};
