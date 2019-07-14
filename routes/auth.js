const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
// Anytime we want to protect a route we need to bring in our middleware
const auth = require("../middleware/auth");

/**
 @route   GET api/auth
 @desc    Get logged in user
 @access  Private
 */
// validate logged in user
// write piece of middleware to get the ID from the token
router.get("/", auth, async (req, res) => {
  try {
    // do not want to return password, only ID
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message, "ERROR MESSAGE");
    res.status(500).json({ msg: "Server Error" });
  }
});

/**
@route   POST api/auth
@desc    Auth user & get token
@access  Public
*/
// validation to make sure an email and password are sent
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // if there is a user then we want to continue to check the password
      // use bcypt.compare method

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message, "ERROR MESSAGE");
      res.status(500).json({ msg: "Server Error " });
    }
  }
);

module.exports = router;
