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
    password: parts[1],
  };
  return user;
}

module.exports = {
  handleAuthHeader
};
