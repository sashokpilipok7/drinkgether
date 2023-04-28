const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const LocalStratagy = require("passport-local").Strategy;

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStratagy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Cannot find such user" });
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Inccorect password" });
            }
          });
        })
        .catch((err) => console.log("Cannot find user "));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err))
  });
};
