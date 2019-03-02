const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users works" }));

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default for the image
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // Hashing the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/register
// @desc   	Login User and returning JWT token
// @access  Private
router.post("/login", (req, res) => {
  // It will send a form in req.body
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email: email }).then(user => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check password, the pass coming from the form is plain
    // text, but on the DB is the hashed one
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched using JWT

        // The payload was created with this info req'ed
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        // Sign token
        // Using the keys as a secure way to pass the secret word
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
