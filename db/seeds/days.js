exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("days").del().then(() => {
    return knex("days").insert([
      {
        habitName: "Drink water",
      },
      {
        habitName: "Stretch",
      },
      {
        habitName: "Practice coding",
      }
    ])
  })
};
