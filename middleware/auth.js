// middleware is a function that has access to
// the request and response cycle and object
// Everytime we hit an endpoint we can fire off this middleware
// to check and see if there is a token in the header
const jwt = require("jsonwebtoken");
const config = require("config");

// after you do what you want to do
// you have to call the next function which just says
// move on to the next piece of middlware
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied " });
  }

  // if there is a token, verify
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // once it gets verified, the payload is going to
    // get put into @decoded. We want to take the user out
    // and assign the user to the request object

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
