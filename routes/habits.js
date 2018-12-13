const express = require("express");
const moment = require("moment");
const uuid = require("uuid/v1");

// Database requirements
const dbconfig = require("../knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);

// Functions
const { checkUserCredentials } = require("../lib/helpers");

module.exports = () => {
  const habitsRouter = express.Router();

  return habitsRouter;
}
