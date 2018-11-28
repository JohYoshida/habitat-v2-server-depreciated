const bcrypt = require('bcrypt');
const uuid = require('uuid/v1');
const { admin_id } = require("../seedData");


const salt = 10;

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users").del().then(() => {
    return knex("users").insert([{
      id: admin_id,
      email: "admin",
      password: bcrypt.hashSync("password", salt),
    }])
  })
};
