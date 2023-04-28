const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/User");

// Login
router.get("/login", (req, res) => res.render("login"));

// Register
router.get("/register", (req, res) => res.render("register"));

// Handle register

router.post("/register", (req, res) => {
  console.log(req.body);

  const { name, email, password, password2 } = req.body;
  const errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    console.log(errors, "errors");
    res.render("register", { errors, name, email, password, password2 });
  } else {
    //  Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("User already exists");
        res.render("register", { errors, name, email, password, password2 });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                console.log("user saved!");
                req.flash(
                  "success_msg",
                  "Registered successfully! Please log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );

        console.log(newUser);
        // res.send(newUser);
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout({options: passport.LogOutOptions }, done => {} );
  res.redirect("/users/login");
});

module.exports = router;