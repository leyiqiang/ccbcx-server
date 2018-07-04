const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminUserSchemaString = 'AdminUser';
// const Joi = require('joi');
const crypto = require('crypto');
// const _ = require('lodash')
// const { groupSchemaString } = require('./group');

const AdminUserSchema = new Schema({
  userName: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
});

AdminUserSchema
.virtual('password')
.set(function (password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
});


// Methods
AdminUserSchema.methods = {
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

AdminUserSchema.statics = {
  // definedPopulate(query) {
  //   return query.populate('group');
  // },

  getUserBasicInfo: async function ({userName}) {
    let user = await this.findOne({
      userName: userName,
    });
    user = user.toObject();
    delete user['hashed_password'];
    delete user['salt'];
    return user;
  },
};


mongoose.model(adminUserSchemaString, AdminUserSchema);

module.exports = {
  adminUserSchemaString,
};