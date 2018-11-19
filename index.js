const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const moment = require("moment");
const uuid = require("uuid/v1");
const PORT = process.env.PORT || 4000;

const app = express();

const dbconfig = require("./knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Habitat server");
});

// Return an array of habits
app.get("/habits", (req, res) => {
  knex("habits")
    .then(rows => {
      rows = JSON.stringify(rows);
      res.send(rows);
    })
    .catch(err => {
      res.send("Failed to get habits!");
      console.log("Error!", err);
    });
});

// Post a new habit
// TODO: Change hardcoded user
app.post("/habits", (req, res) => {
  const now = moment().format();
  let id = uuid();
  const { name, color } = req.body;
  knex("habits")
    .insert({
      id,
      user: "johyoshida@gmail.com",
      name,
      color,
      createdAt: now,
      modifiedAt: now
    })
    .then(() => {
      id = uuid();
      knex("habitCalendars")
        .insert({
          id,
          habit: name,
          year: 2018,
          Jan: "0000000000000000000000000000000",
          Feb: "00000000000000000000000000000",
          Mar: "0000000000000000000000000000000",
          Apr: "000000000000000000000000000000",
          May: "0000000000000000000000000000000",
          Jun: "000000000000000000000000000000",
          Jul: "0000000000000000000000000000000",
          Aug: "0000000000000000000000000000000",
          Sep: "000000000000000000000000000000",
          Oct: "0000000000000000000000000000000",
          Nov: "000000000000000000000000000000",
          Dec: "0000000000000000000000000000000"
        })
        .then(() => {
          res.send({
            msg: `Created newData habit "${name}"`,
            habit: {
              id,
              user: "johyoshida@gmail.com",
              name,
              color,
              createdAt: now,
              modifiedAt: now
            }
          });
        });
    })
    .catch(err => {
      res.send("Failed to create habit!");
      console.log("Error!", err);
    });
});

// Delete a habit
app.delete("/habits", (req, res) => {
  console.log(req.body);
  knex("habits")
    .where({ name: req.body.name })
    .del()
    .then(() => {
      res.send({ msg: `Deleted habit ${req.body.name}` });
    })
    .catch(err => {
      console.log("Error!", err);
    });
});

// Return a habit calendar
app.get("/habits/:habit/:year", (req, res) => {
  const { habit, year } = req.params;
  knex("habitCalendars")
    .first()
    .where({ habit, year })
    .then(rows => {
      rows = JSON.stringify(rows);
      res.send({ rows });
    })
    .catch(err => {
      res.send("Failed to get habit calendar!");
      console.log("Error!", err);
    });
});

// Update a habit calendar
app.post("/habits/:habit/:year", (req, res) => {
  let { habit, year } = req.params;
  let { day, completed } = req.body;
  const month = day.split("-")[0];
  day = day.split("-")[1];
  year = Number(year);
  knex("habitCalendars")
    .first()
    .where({ habit, year })
    .then(rows => {
      let old = rows[month];
      let newData = "";
      if (completed) {
        newData = old.substr(0, day - 1) + "1" + old.substr(day);
      } else {
        newData = old.substr(0, day - 1) + "0" + old.substr(day);
      }
      rows[month] = newData;
      knex("habitCalendars")
        .first()
        .where({ habit, year })
        .update({
          Jan: rows["Jan"],
          Feb: rows["Feb"],
          Mar: rows["Mar"],
          Apr: rows["Apr"],
          May: rows["May"],
          Jun: rows["Jun"],
          Jul: rows["Jul"],
          Aug: rows["Aug"],
          Sep: rows["Sep"],
          Oct: rows["Oct"],
          Nov: rows["Nov"],
          Dec: rows["Dec"]
        })
        .then(updated => {
          if (updated) {
            res.send({ msg: true });
          } else {
            res.send({ msg: false });
          }
        })
        .catch(err => {
          res.send({ msg: "Failed to update!" });
          console.log("Error!", err);
        });
    })
    .catch(err => {
      res.send({ msg: "Failed to get days!" });
      console.log("Error!", err); 
    });
});

// Register a user
app.post("/users", (req, res) => {
  const token = req.headers.authorization.split(/\s+/).pop() || "";
  const auth = new Buffer.from(token, "base64").toString();
  const parts = auth.split(":");
  const email = parts[0];
  const password = parts[1];
  const id = uuid();
  // Check for existing user
  knex("users")
    .first()
    .where({ email })
    .then(user => {
      if (user) {
        res.send({ msg: "A user with that email already exists." });
      } else {
        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
          // Insert new user into db
          knex("users")
            .insert({ id, email, password: hash })
            .then(() => res.send({ msg: "Registed user " + email }));
        });
      }
    });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
