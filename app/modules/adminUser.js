'use strict';
const jwt = require('jsonwebtoken');
const config = require('../../config');
const mongoose = require('mongoose');
const { adminUserSchemaString } = require('../models/adminUser');
const Joi = require('joi');

const AdminUser = mongoose.model(adminUserSchemaString);

const joiAdminUserSchema = Joi.object().keys({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  nickName: Joi.string().min(1).max(30).required(),
  password: Joi.string().required(),
  groupName: Joi.string().optional(),
});

const joiAdminUserPasswordSchema = Joi.object().keys({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
});

/**
 * private helper method for verifying token
 * @param token
 * @returns {Promise}
 */
async function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}

function generateJwtTokenForUser({ userName }) {
  return jwt.sign({ userName }, config.secret, {
    expiresIn: 60 * 60 * 24 * 7, // expires in a week
  });
}

async function verifyUser({ userName }, token) {
  try {
    const decodedToken = await decodeToken(token);
    if (userName.toString() === decodedToken.userName) {
      return {
        auth: true,
      };
    } else {
      return {
        auth: false,
        message: 'User Id does not match the token User Id',
      }
    }
  } catch(error) {
    return {
      auth: false,
      message: error,
    }
  }
}

async function getUser({ userName }) {
  return AdminUser.findOne({ userName })
}

async function getUserByUserName({ userName }) {
  return AdminUser.getUserBasicInfo({ userName })
}

// async function createUser({ userName, nickName, password }) {
//   const newUser = new AdminUser({userName, nickName, password})
//   return newUser.save()
// }

async function updatePassword({userName, password}) {
  const user = await AdminUser.findOne({
    userName,
  })
  const hashed_password = await user.encryptPassword(password)
  return AdminUser.findOneAndUpdate({
    userName,
  }, {
    hashed_password,
  })
}

module.exports = {
  joiAdminUserSchema,
  joiAdminUserPasswordSchema,
  decodeToken,
  getUser,
  verifyUser,
  updatePassword,
  generateJwtTokenForUser,
  getUserByUserName,
}