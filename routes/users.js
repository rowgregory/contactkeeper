const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

// create a piece of middleware that will check the token in the header
// and then extract the id

const User = require("../models/User");
/**
@route   POST api/users
@desc    Regsiter a user
@access  Public
 */
router.post(
  "/",
  [
    check("name", "Please enter a name")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // check to see if user exists
      let user = await User.findOne({ email });

      // if the user already exists it will return an error
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // new user instance
      user = new User({
        name,
        email,
        password
      });

      // Encrypt/hash password, genSalt method returns a promise
      // Salt takes in a number of rounds, determines how secure the salt is
      const salt = await bcrypt.genSalt(10);
      console.log(salt, "SALT");

      // take the salt and hash the password
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // object to send in the token
      const payload = {
        user: {
          id: user.id
        }
      };
      // generate a token
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          // respond with token
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.mesage, "ERROR");

      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
