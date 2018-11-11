const uuid = require('uuid/v1');

const id1 = uuid();
const id2 = uuid();
const id3 = uuid();

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("days").del().then(() => {
    return knex("days").insert([
      {
        id: id1,
        habitName: "Drink water",
      },
      {
        id: id2,
        habitName: "Stretch",
      },
      {
        id: id3,
        habitName: "Practice coding",
      }
    ])
  })
};
