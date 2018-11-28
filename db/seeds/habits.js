const bcrypt = require('bcrypt');
const uuid = require('uuid/v1');
const moment = require('moment');
const { admin_id } = require("../seedData");

const id1 = uuid();
const id2 = uuid();
const id3 = uuid();
const now = moment().format();

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex("habits").del().then(() => {
    return knex("habits").insert([{
      id: id1,
      user_id: admin_id,
      name: "Drink water",
      color: "blue",
      createdAt: now,
      modifiedAt: now,
    },
    {
      id: id2,
      user_id: admin_id,
      name: "Exercise",
      color: "red",
      createdAt: now,
      modifiedAt: now,
    },
    {
      id: id3,
      user_id: admin_id,
      name: "Practice coding",
      color: "green",
      createdAt: now,
      modifiedAt: now,
    }])
  })
};
