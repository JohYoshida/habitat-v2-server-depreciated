const bcrypt = require('bcrypt');
const uuid = require('uuid/v1');
const moment = require('moment');

const id1 = uuid();
const id2 = uuid();
const id3 = uuid();
const now = moment().format();

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("habits").del().then(() => {
    return knex("habits").insert([{
      id: id1,
      user: "johyoshida@gmail.com",
      name: "Drink water",
      createdAt: now,
      modifiedAt: now,
    },
    {
      id: id2,
      user: "johyoshida@gmail.com",
      name: "Stretch",
      createdAt: now,
      modifiedAt: now,
    },
    {
      id: id3,
      user: "johyoshida@gmail.com",
      name: "Practice coding",
      createdAt: now,
      modifiedAt: now,
    }])
  })
};
