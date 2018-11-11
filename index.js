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

app.get("/test", (req, res) => {
  knex("users").where({
    email: "johyoshida@gmail.com"
  }).then(rows => {
    res.send(rows[0]);
  }).catch(err => {
    res.send("Failed to get users")
    console.log("Error!", err);
  });
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
  const id = uuid();
  knex("habits").insert({
    id,
    user: "johyoshida@gmail.com",
    name: req.body.name,
    createdAt: now,
    modifiedAt: now,
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
  }).catch(err => {
    console.log("Error!", err);
  });
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
