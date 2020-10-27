const expressJwt = require('express-jwt');
const jwt = require("jsonwebtoken");

function isAuthenticated() {
  return expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });
}

function isManager(req, res, next) {
  const decodedToken = jwt.decode(req.session.token);
  if (decodedToken == null || !decodedToken.role == "manager") {
    return res.render("./../views/shared/unautorized");
  }
  if (decodedToken.role == "manager") {
    jwt.verify(req.session.token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  }
}

function isEmployee(req, res, next) {
  const token = jwt.decode(req.session.token);
  if (token == null || !token.role == "employee") {
    return res.render("./../views/shared/unautorized");
  }
  if (token.role == "employee") {
    jwt.verify(req.session.token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  }
}

function authenticateToken(req, res, next) {
  const sessionToken = req.session.token;
  if (sessionToken == null) {
    return res.redirect("/auth/login");
  }
  jwt.verify(req.session.token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log("user", req.user);
    next();
  })
}

function isAuthorized(roles = []) {
  if (typeof roles == 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.render("./../views/shared/unautorized");
      }

      //authentication passed
      next();
    }
  ]
}

module.exports = {
  isAuthenticated,
  isAuthorized,
  isEmployee,
  isManager,
  authenticateToken
};
