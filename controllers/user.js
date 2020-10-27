const User = require("../models/user");

/* To register a new user */
function registerUser(req, res, next) {
    const user = new User(req.body);
    user.setHashedPassword();
    // check if user already exists in database
    User.findOne({ username: req.body.username })
        .then((userFound) => {
            if (userFound) {
                // if user exists already
                res.render("../views/user/register", {
                    user: {
                        username: req.body.username
                    },
                    message: `User Id ${req.body.username} exists`,
                    isLoggedIn: false
                })
            }
            else {
                // save the new user
                user.save((err, savedUser) => {
                    if (err) {
                        if (err.errors.username) {
                            res.render("../views/user/register", {
                                user: {},
                                message: err.errors.username,
                                isLoggedIn: false
                            })
                        } else if (err.errors.password) {
                            res.render("../views/user/register", {
                                user: {},
                                message: err.errors.password,
                                isLoggedIn: false
                            })
                        } else if (err.errors.role) {
                            res.render("../views/user/register", {
                                user: {},
                                message: err.errors.role,
                                isLoggedIn: false
                            })
                        }
                    }
                    res.render("./../views/user/login", {
                        user: {},
                        message: 'User Registered Successfully.!!',
                        isLoggedIn: false
                    });
                });
            }
        });
}

/* Logged in existing user */
function loginUser(req, res, next) {
    if (req.session.token != null) {
        req.session.token = null;
    }
    req.user = req.user.toAuthJson();
    req.session.token = req.user.role + "_" + req.user.token;
    res.redirect("/jobs");
}

/* Logged out logged in user */
function logoutUser(req, res, next) {
    req.session.token = null;
    res.render("./../views/user/login", {
        user: {},
        message: '',
        isLoggedIn: false
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}