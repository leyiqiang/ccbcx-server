const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchemaString = 'User';
const Joi = require('joi');
const crypto = require('crypto');

const { groupSchemaString } = require('./group');

const UserSchema = new Schema({
  userName: { type: String, default: '', unique: true },
  hashed_password: { type: String, default: '' },
  email: { type: String, default: '' },
  salt: { type: String, default: '' },
  groupName: { type: String, default: '' }
});

const JoiUserSchema = Joi.object().key({
  userName: Joi.string(),
  password: Joi.string(),
  email: Joi.string().email(),
  groupName: Joi.string(),
});

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
});

UserSchema.virtual('group', {
  ref: groupSchemaString,
  localField: 'groupName',
  foreignField: 'name',
  justOne: true,
});

// Validations

UserSchema.path('userName').validate(function (email) {
  return email.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length && this._passport.length;
}, 'Password cannot be blank');

UserSchema.path('email').validate(function (email) {
  return email.length;
}, 'Email cannot be blank');

// Methods
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    return crypto
    .createHmac('sha256', this.salt)
    .update(password)
    .digest('hex');
  },
};

UserSchema.statics = {
  definedPopulate(query) {
    return query.populate('group');
  },

  getUserBasicInfo: async function ({userName}) {
    let user = await this.findOne({
      userName: userName,
    });
    user = user.toObject();
    delete user['hashed_password'];
    delete user['salt'];
    return user;
  }
};


mongoose.model(userSchemaString, UserSchema);

module.exports = {
  userSchemaString,
  JoiUserSchema,
};