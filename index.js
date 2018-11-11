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

app.get("/habits", (req, res) => {
  knex("habits").then(rows => {
    rows = JSON.stringify(rows);
    res.send(rows);
  }).catch(err => {
    res.send("Failed to get habits!");
    console.log("Error!", err);
  })
})

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
    knex("days").insert({ id, habitName: req.body.name })
      .then(() => {
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
    console.log("Error!", err);
  });
});

app.get("/days/:habitName", (req, res) => {
  console.log(req.params);
  knex("days").where({ habitName: req.params.habitName }).then(rows => {
    rows = JSON.stringify(rows);
    res.send({ days });
  });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
