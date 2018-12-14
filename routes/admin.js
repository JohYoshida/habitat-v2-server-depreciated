const express = require("express");
const moment = require("moment");
const uuid = require("uuid/v1");

// Database requirements
const dbconfig = require("../knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);

// Functions
const { checkUserCredentials, handleAuthHeader } = require("../lib/helpers");

module.exports = () => {
  const adminRoutes = express.Router();

  // Login
  adminRoutes.get("/", (req, res) => {
    const user = handleAuthHeader(req.headers.authorization);
    if (user.email === "admin") {
      checkUserCredentials(req.headers.authorization).then(result => {
        req.session.isLoggedIn = true;
        res.send(result);
      });
    } else {
      res.send({ msg: "This is an admin only area!", verified: false });
    }
  });

  // Logout
  adminRoutes.post("/", (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect("/")
  });

  return adminRoutes;
}
