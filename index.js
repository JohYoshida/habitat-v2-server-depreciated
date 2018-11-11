const express = require("express");
const PORT = process.env.PORT || 4000;

const app = express();
const bodyParser = require("body-parser");

const dbconfig = require("./knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);


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
  })
});

app.post("/habitat", (req, res) => {
  console.log(req.body);
  res.send("Post recieved.");
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
