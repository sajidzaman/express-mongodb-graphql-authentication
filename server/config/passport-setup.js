const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for strategy
      clientID:
        "276267134476-ju75i8v7holahfeisur2n299qetb70dt.apps.googleusercontent.com",
      clientSecret: "6Q1YZ4L9fLmzp_z9EtTfCp6_",
      callbackURL: "/auth/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback function
      console.log("passport callback function fired");
      console.log(accessToken, refreshToken, profile);

      //search if users exists
      User.findOne({
        googleId: profile.id
      }).then(currentUser => {
        if (currentUser) {
          console.log("user is", currentUser);
          done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            username: profile.displayName,
            googleId: profile.id
          })
            .save()
            .then(newUser => {
              console.log("new user created", newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
