const express = require("express");

// Database requirements
const dbconfig = require("../knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);

module.exports = () => {
  const quotesRoutes = express.Router();

  // Routes are prepended with /quotes

  return quotesRoutes;
}
