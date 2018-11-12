
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("habitCalendars", table => {
      table.uuid("id").primary();
      table.string("habit");
      table.integer("year");
      table.string("jan");
      table.string("feb");
      table.string("mar");
      table.string("apr");
      table.string("may");
      table.string("jun");
      table.string("jul");
      table.string("aug");
      table.string("sep");
      table.string("oct");
      table.string("nov");
      table.string("dec");
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("habitCalendars"),
  ]);
};
