const dbconfig = require("../knexfile.js")[process.env.DB_ENV];
const knex = require("knex")(dbconfig);
const bcrypt = require("bcrypt");

function checkUserCredentials(header) {
  const { email, password } = handleAuthHeader(header);
  return new Promise((resolve, reject) => {
    knex("users")
      .first()
      .where({ email })
      .then(user => {
        if (user) {
          // Check password against hash
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              resolve({
                msg: "Credentials verified.",
                verified: true,
                id: user.id
              });
            } else {
              resolve({ msg: "Incorrect email or password.", verified: false });
            }
          });
        } else {
          resolve({ msg: "Incorrect email or password.", verified: false });
        }
      })
      .catch(err => {
        resolve({ msg: "Failed to login!" });
        console.log("Error!", err);
      });
  });
}

/**
 * [handleAuthHeader description]
 * @param  {object} header HTML Authorization header
 * @return {object}        Object containing decoded email and password
 */
function handleAuthHeader(header) {
  // Extract base64 encoded token from authorization header
  const token = header.split(/\s+/).pop() || "";
  // Decode and break into email and password
  const auth = new Buffer.from(token, "base64").toString();
  const parts = auth.split(":");
  const user = {
    email: parts[0],
    password: parts[1]
  };
  return user;
}

module.exports = {
  handleAuthHeader,
  checkUserCredentials
};
