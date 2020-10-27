const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require("../controllers/user");

/* Render login form */
router.get("/login", function (req, res, next) {
  req.session.token = null;
  res.render("./../views/user/login", {
    user: {},
    message: '',
    isLoggedIn: false,
  });
});

/* Render User Regsitration form */
router.get("/register", function (req, res, next) {
  res.render("./../views/user/register", {
    user: {},
    message: '',
    isLoggedIn: false
  });
});

/* Register a new user */
router.post('/register', UserController.registerUser);

/* Login user */
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  function (req, res, next) {
    if (req.session.token != null) {
      req.session.token = null;
    }
    req.user = req.user.toAuthJson();
    req.session.token = req.user.token;
    res.redirect("/jobs");
  }
);

/*Logout User */
router.get('/logout', UserController.logoutUser);

module.exports = router;
