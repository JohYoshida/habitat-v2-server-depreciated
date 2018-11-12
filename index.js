const express = require("express");
const bodyParser = require("body-parser");
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
  knex("habits").then(rows => {
    rows = JSON.stringify(rows);
    res.send(rows);
  }).catch(err => {
    res.send("Failed to get habits!");
    console.log("Error!", err);
  })
})

// Post a new habit
// TODO: Change hardcoded user
app.post("/habits", (req, res) => {
  const now = moment().format();
  let id = uuid();
  knex("habits").insert({
    id,
    user: "johyoshida@gmail.com",
    name: req.body.name,
    createdAt: now,
    modifiedAt: now,
  }).then(() => {
    id = uuid();
    knex("habitCalendars").insert({
      id,
      habit: req.body.name,
      year: 2018,
      jan: "0000000000000000000000000000000",
      feb: "00000000000000000000000000000",
      mar: "0000000000000000000000000000000",
      apr: "000000000000000000000000000000",
      may: "0000000000000000000000000000000",
      jun: "001000000000000000000000000000",
      jul: "0000000000000000000000000000000",
      aug: "0000000000000000000000000000000",
      sep: "000000000000000000000000000000",
      oct: "0000000000000000000000000000000",
      nov: "000000000000000000000000000000",
      dec: "0000000000000000000000000000000",
    }).then(() => {
      res.send({
        msg: `Created new habit "${req.body.name}"`,
        habit: {
          id,
          user: "johyoshida@gmail.com",
          name: req.body.name,
          createdAt: now,
          modifiedAt: now,
        }
      });
    })
  }).catch(err => {
    res.send("Failed to create habit!");
    console.log("Error!", err);
  });
});

// Delete a habit
app.delete("/habits", (req, res) => {
  console.log(req.body);
  knex("habits").where({ name: req.body.name }).del()
    .then(() => {
      res.send({ msg: `Deleted habit ${req.body.name}`});
    }).catch(err => {
      console.log("Error!", err);
    })
});

// Return a habit calendar
app.get("/habits/:habit/:year", (req, res) => {
  console.log(req.params);
  knex("habitCalendars").first()
    .where({ habit: req.params.habit, year: req.params.year })
    .then(rows => {
      rows = JSON.stringify(rows);
      res.send({ rows });
    }).catch(err => {
      res.send("Failed to get days!");
      console.log("Error!", err);
    });
});

// Update a habit calendar
app.post("/habits/:habit/:year", (req, res) => {
  console.log("body", req.body);
  console.log("params", req.params);
  // knex("habitCalendars").where({ name: req.body.habit })
  //   .update({ `${req.body.day}`: completed })
  //   .then(() => {
  //     res.send({ msg: "Updated days." });
  //   }).catch(err => {
  //     res.send("Failed to update days!")
  //     console.log("Error!", err);
  //   });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
