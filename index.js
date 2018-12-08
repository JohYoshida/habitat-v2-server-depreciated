// Server requirements
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const moment = require("moment");
const uuid = require("uuid/v1");
const PORT = process.env.PORT || 4000;
const app = express();

// Database requirements
const dbconfig = require("./knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);

// Functions
const { handleAuthHeader, checkUserCredentials } = require("./lib/helpers");

// parse application/json
app.use(bodyParser.json());

// Home
app.get("/", (req, res) => {
  res.send("Habitat server");
});

// Login as a user
app.get("/users", (req, res) => {
  // Check for existing user
  checkUserCredentials(req.headers.authorization).then(result => {
    res.send(result);
  });
});

// Register a user
app.post("/users", (req, res) => {
  const { email, password } = handleAuthHeader(req.headers.authorization);
  // Check for existing user
  knex("users")
    .first()
    .where({ email })
    .then(user => {
      if (user) {
        res.send({
          msg: "A user with that email already exists.",
          verified: false
        });
      } else {
        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
          // Insert new user into db
          const id = uuid();
          knex("users")
            .insert({ id, email, password: hash })
            .then(() =>
              res.send({ msg: "Registed user " + email, verified: true, id })
            );
        });
      }
    })
    .catch(err => {
      res.send({ msg: "Failed to register user!", verified: false });
      console.log("Error!", err);
    });
});

// Return an array of habits belonging to a user
app.get("/users/:user_id/habits", (req, res) => {
  checkUserCredentials(req.headers.authorization).then(result => {
    if (result.id === req.params.user_id && result.verified) {
      knex("habits")
        .where({ user_id: req.params.user_id })
        .then(rows => {
          res.send(JSON.stringify(rows));
        })
        .catch(err => {
          res.send("Failed to get habits!");
          console.log("Error!", err);
        });
    } else
      new Promise(function(resolve, reject) {
        res.send("Failed to get habits!");
      });
  });
});

// Post a new habit
app.post("/users/:user_id/habits", (req, res) => {
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

// Delete a habit
app.delete("/users/:user_id/habits", (req, res) => {
  const { name, habit_id } = req.body;
  const { user_id } = req.params;
  checkUserCredentials(req.headers.authorization).then(result => {
    if (result.id === user_id && result.verified) {
      // Delete the habit
      knex("habits")
        .where({ user_id, name })
        .del()
        .then(() => {
          // Delete all days associated with habit
          knex("days")
            .where({ habit_id })
            .del()
            .then(() => {
              res.send({ msg: `Deleted habit ${req.body.name}` });
            })
            .catch(err => {
              console.log("Error!", err);
              res.send({
                msg: "Failed to delete days associated with habit habit"
              });
            });
        })
        .catch(err => {
          console.log("Error!", err);
          res.send({ msg: "Failed to delete habit" });
        });
    }
  });
});

// Get days in a year
app.get("/users/:user_id/habits/:habit_id/:year", (req, res) => {
  const { user_id, habit_id, year } = req.params;
  knex("days")
    .where({ habit_id, year })
    .then(rows => {
      rows = JSON.stringify(rows);
      res.send(rows);
    })
    .catch(err => {
      res.send({ msg: "Failed to get days!" });
      console.log("Error!", err);
    });
});

// Post a new day
app.post("/users/:user_id/habits/:habit_id/:year", (req, res) => {
  const { user_id, habit_id, year } = req.params;
  const { day, month, value } = req.body;
  const data = {
    id: uuid(),
    habit_id,
    day,
    month,
    year,
    value
  };
  knex("days")
    .where({ habit_id, day, month, year })
    .then(rows => {
      if (!rows.length) {
        knex("days")
          .insert(data)
          .then(() => {
            res.send({ msg: "Created new record for day", data });
          })
          .catch(err => {
            res.send({ msg: "Failed to create day!" });
            console.log("Error!", err);
          });
      } else res.send({ msg: "Record for that day already exists!" });
    })
    .catch(err => {
      res.send({ msg: "Failed to get day!" });
      console.log("Error!", err);
    });
});

// Edit a day
app.post("/users/:user_id/habits/:habit_id/:year/:month/:day", (req, res) => {
  const { user_id, habit_id, year, month, day } = req.params;
  const { newValue } = req.body;
  knex("days")
    .first()
    .where({ habit_id, day, month, year })
    .update({ value: newValue })
    .then(() => res.send({ msg: "Successfully updated day." }))
    .catch(err => {
      res.send({ msg: "Failed to update day" });
      console.log("Error!", err);
    });
});

// Delete a day
app.delete("/users/:user_id/habits/:habit_id/:year/:month/:day", (req, res) => {
  const { user_id, habit_id, year, month, day } = req.params;
  knex("days")
    .where({ habit_id, day, month, year })
    .del()
    .then(() => res.send({ msg: "Successfully deleted day." }))
    .catch(err => {
      res.send({ msg: "Failed to delete day" });
      console.log("Error!", err);
    });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
