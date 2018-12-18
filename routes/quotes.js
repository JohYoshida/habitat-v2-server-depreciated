const express = require("express");

// Database requirements
const dbconfig = require("../knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);

const { handleAuthHeader, checkUserCredentials } = require("../lib/helpers");

module.exports = () => {
  const quotesRoutes = express.Router();

  // Routes are prepended with /quotes
  quotesRoutes.get("/:user_id", (req, res) => {
    const { user_id } = req.params;
    checkUserCredentials(req.headers.authorization).then(user => {
      if (user.id === user_id && user.verified) {
        knex("quotes")
          .where({ user_id: req.params.user_id })
          .then(rows => {
            res.send(JSON.stringify(rows));
          })
          .catch(err => {
            res.send("Failed to get quotes!", err);
            console.log("Error!", err);
          });
      } else {
        new Promise((resolve, reject) => {
          res.send("Failed to get quotes!");
        })
      }
    })
  });

  return quotesRoutes;
}
