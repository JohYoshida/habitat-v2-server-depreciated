
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('days').del()
    .then(function () {
      // Inserts seed entries
      return knex('days').insert([
      ]);
    });
};
