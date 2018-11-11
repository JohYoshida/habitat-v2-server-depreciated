const bcrypt = require('bcrypt');
const uuid = require('uuid/v1');

const id = uuid();
const salt = 10;

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users").del().then(() => {
    return knex("users").insert([{
      id,
      username: "admin",
      email: "johyoshida@gmail.com",
      password: bcrypt.hashSync("password", salt),
    }])
  })
};
