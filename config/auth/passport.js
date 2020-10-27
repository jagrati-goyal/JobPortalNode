const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/user');

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne(
      {
        username,
      },
      async (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user || !(await user.validatePassword(password))) {
          return done(null, false);
        }

        return done(null, user);
      }
    );
  })
);
