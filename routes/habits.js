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

  // Return an array of habits belonging to a user
  habitsRouter.get("/:user_id", (req, res) => {
    checkUserCredentials(req.headers.authorization).then(result => {
      if (result.id === req.params.user_id && result.verified) {
        knex("habits")
          .where({ user_id: req.params.user_id })
          .then(rows => {
            res.send(JSON.stringify(rows));
          })
          .catch(err => {
            res.send("Failed to get habits!", err);
            console.log("Error!", err);
          });
      } else
        new Promise(function(resolve, reject) {
          res.send("Failed to get habits!");
        });
    });
  });

  // Post a new habit
  habitsRouter.post("/:user_id", (req, res) => {
    const now = moment().format();
    const { name, color } = req.body;
    const { user_id } = req.params;
    let id = uuid();
    let habit = {
      id,
      user_id,
      name,
      color,
      createdAt: now,
      modifiedAt: now
    };
    checkUserCredentials(req.headers.authorization).then(result => {
      if (result.id === user_id && result.verified) {
        knex("habits")
          .insert(habit)
          .then(() => res.send({ habit, msg: `Created new habit "${name}"` }))
          .catch(err => {
            res.send("Failed to create habit!");
            console.log("Error!", err);
          });
      }
    });
  });

  return habitsRouter;
}
