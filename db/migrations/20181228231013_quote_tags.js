
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("quotes", table => {
      table.string("tags");
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("quotes", table => {
        table.dropColumn("tags");
    }),
  ]);
};
