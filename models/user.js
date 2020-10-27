const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const jwtSecret = process.env.JWT_SECRET;
const saltRounds = process.env.SALT_ROUNDS || 10;

const Roles = Object.freeze({
  Employee: 'employee',
  Manager: 'manager'
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: Object.values(Roles),
    required: true
  }
});

Object.assign(UserSchema.statics, { Roles });

UserSchema.methods.setHashedPassword = async function () {
  const hashedPassword = await bcrypt.hash(this.password, saltRounds);
  this.password = hashedPassword;
};

UserSchema.methods.validatePassword = async function (password) {
  const pwdMatches = await bcrypt.compare(password, this.password);
  return pwdMatches;
};

UserSchema.methods.generateJwtToken = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 1);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
      role: this.role
    },
    jwtSecret
  );
};

UserSchema.methods.toAuthJson = function () {
  return {
    username: this.username,
    _id: this._id,
    token: this.generateJwtToken(),
    role: this.role
  };
};

module.exports = mongoose.model('User', UserSchema);
