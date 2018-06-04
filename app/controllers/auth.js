'use strict';

const express = require('express')
const userModule = require('../modules/user')
const _ = require('lodash')
const router = express.Router();
const Joi = require('joi')
const { JoiUserSchema } = require('../models/user')
const { sendJoiValidationError } = require('../utils/joi')

router.post('/signIn', async function (req, res) {
  try {
    const { userName, password } = req.body;
    const user = await userModule.getUserByUserName({ userName })
    if (!user) {
      return res.status(404).send('User does not exist.')
    }
    const isValidPassword = user.authenticate(password)
    if (!isValidPassword) {
      return res.status(401).send({ auth: false, token: null })
    }
    const token = userModule.generateJwtTokenForUser({
      userName: user.userName,
    })
    res.status(200).send({ auth:true, token: token })
  } catch (err) {
    return res.sendStatus(500)
  }
});


router.post('/signUp', async function (req, res) {
  const fieldList = ['userName', 'nickName', 'password']
  const newUserFormBody = _.pick(req.body, fieldList)

  const joiResult = Joi.validate(newUserFormBody, JoiUserSchema, {
    presence: 'required',
    abortEarly: false,
  })

  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }
  try {
    const user = await userModule.getUserByUserName({ userName: newUserFormBody.userName })
    if (!_.isNil(user)) {
      return res.status(400).send({success: false, message: 'User already exist'})
    }

    const newUser = await userModule.createUser({
      userName: newUserFormBody.userName,
      nickName: newUserFormBody.nickName,
      password: newUserFormBody.password,
    })
    const token = userModule.generateJwtTokenForUser({
      userName: newUser.userName,
    })

    res.json({
      success: true,
      message: 'Success',
      token: token,
      auth: true,
    })
  } catch (err) {
    return res.status(500).json({success: false, message: err.message})
  }
});

module.exports = router;
