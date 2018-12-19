const express = require("express");
const uuid = require("uuid/v1");
const moment = require("moment");

// Database requirements
const dbconfig = require("../knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);

const { handleAuthHeader, checkUserCredentials } = require("../lib/helpers");

module.exports = () => {
  // Routes are prepended with /quotes
  const quotesRoutes = express.Router();

  // Get an array of quotes belonging to a user
  quotesRoutes.get("/:user_id", (req, res) => {
    const { user_id } = req.params;
    checkUserCredentials(req.headers.authorization).then(user => {
      if (user.id === user_id && user.verified) {
        knex("quotes")
          .where({ user_id })
          .then(rows => {
            res.send(JSON.stringify(rows));
          })
          .catch(err => {
            res.send("Failed to get quotes!");
            console.log("Error!", err);
          });
      } else {
        new Promise((resolve, reject) => {
          res.send("Authentication failed");
        });
      }
    });
  });

  // Post a new quote
  quotesRoutes.post("/:user_id", (req, res) => {
    const now = moment().format();
    const id = uuid();
    const { text, author, source } = req.body;
    const { user_id } = req.params;
    let quote = {
      id,
      user_id,
      text,
      author,
      source,
      createdAt: now,
      modifiedAt: now
    };
    checkUserCredentials(req.headers.authorization).then(user => {
      if (user.id === user_id && user.verified) {
        knex("quotes")
          .insert(quote)
          .then(() => res.send({ quote, msg: "Created new quote." }))
          .catch(err => {
            res.send({ msg: "Failed to create quote!" });
            console.log("Error", err);
          });
      } else {
        new Promise((resolve, reject) => {
          res.send({ msg: "Authentication failed" });
        });
      }
    });
  });

  // Edit a quote
  quotesRoutes.post("/:user_id/:quote_id", (req, res) => {
    const modifiedAt = moment().format();
    const { user_id, quote_id } = req.params;
    const { text, author, source } = req.body;
    checkUserCredentials(req.headers.authorization).then(user => {
      if (user.id === user_id && user.verified) {
        knex("quotes")
          .where({ user_id, id: quote_id })
          .update({ text, author, source, modifiedAt })
          .then(rows => res.send({ msg: "Successfully edited quote" }))
          .catch(err => {
            res.send({ msg: "Failed to edit quote!" });
            console.log("Error", err);
          });
      } else {
        new Promise((resolve, reject) => {
          res.send({ msg: "Authentication failed" });
        });
      }
    });
  });

  return quotesRoutes;
};
