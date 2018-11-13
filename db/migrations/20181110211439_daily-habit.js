
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("habitCalendars", table => {
      table.uuid("id").primary();
      table.string("habit");
      table.integer("year");
      table.string("Jan");
      table.string("Feb");
      table.string("Mar");
      table.string("Apr");
      table.string("May");
      table.string("Jun");
      table.string("Jul");
      table.string("Aug");
      table.string("Sep");
      table.string("Oct");
      table.string("Nov");
      table.string("Dec");
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("habitCalendars"),
  ]);
};
