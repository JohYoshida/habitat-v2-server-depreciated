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
            let quotes = [];
            new Promise((resolve, reject) => {
              rows.forEach(quote => {
                quote.tags = [];
                knex("quote_tags")
                  .where({ quote_id: quote.id })
                  .then(rows => {
                    if (rows.length) {
                      rows.forEach(row => {
                        knex("tags")
                          .where({ id: row.tag_id })
                          .first()
                          .then(tag => {
                            quote.tags.push(tag);
                            resolve();
                          })
                          .catch(err => {
                            res.send("Failed to get quote_tags!");
                            console.log("Error!", err);
                          });
                      });
                      quotes.push(quote);
                    }
                  })
                  .catch(err => {
                    res.send("Failed to get quote_tags!");
                    console.log("Error!", err);
                  });
              });
            }).then(() => res.send(JSON.stringify(quotes)));
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
    const quote_id = uuid();
    const { text, author, source, tags } = req.body;
    const { user_id } = req.params;
    let quote = {
      id: quote_id,
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
          .then(() => {
            tags.forEach(tag => {
              knex("tags")
                .where({ tag })
                .first()
                .then(row => {
                  const quote_tag_id = uuid();
                  if (row) {
                    // Tag exists, so make junction relating tag and quote
                    knex("quote_tags")
                      .insert({ id: quote_tag_id, quote_id, tag_id: row.id })
                      .then(res.send({ quote, msg: "Created new quote" }));
                  } else {
                    // Tag doesn't exist, insert tag and junction
                    const tag_id = uuid();
                    knex("tags")
                      .insert({ id: tag_id, tag })
                      .then(() => {
                        knex("quote_tags")
                          .insert({
                            id: quote_tag_id,
                            quote_id,
                            tag_id
                          })
                          .then(res.send({ quote, msg: "Created new quote" }));
                      });
                  }
                });
            });
          })
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
    const { text, author, source, tags } = req.body;
    checkUserCredentials(req.headers.authorization).then(user => {
      if (user.id === user_id && user.verified) {
        knex("quotes")
          .where({ user_id, id: quote_id })
          .update({ text, author, source, modifiedAt, tags })
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

  // Delete a quote
  quotesRoutes.delete("/:user_id/:quote_id", (req, res) => {
    const { user_id, quote_id } = req.params;
    checkUserCredentials(req.headers.authorization).then(user => {
      if (user.id === user_id && user.verified) {
        knex("quotes")
          .where({ user_id, id: quote_id })
          .del()
          .then(rows => res.send({ msg: "Successfully deleted quote" }))
          .catch(err => {
            res.send({ msg: "Failed to delete quote!" });
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
