'use strict';

const express = require('express')
const { getUser, updatePassword } = require('../modules/user')
const _ = require('lodash')
const router = express.Router();
const Joi = require('joi')
const { joiUserPasswordSchema } = require('../modules/user')
const { sendJoiValidationError } = require('../utils/joi')

const authorization = require('../middlewares/auth')
router.use(authorization.requiresLogin)

router.post('/change', async function (req, res) {
  const { userName } = req.decodedToken;
  const fieldList = ['password']
  let newUserFormBody = _.pick(req.body, fieldList)
  newUserFormBody.userName = userName
  const joiResult = Joi.validate(newUserFormBody, joiUserPasswordSchema, {
    presence: 'required',
    abortEarly: false,
  })

  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }
  try {
    const user = await getUser({ userName: newUserFormBody.userName })
    if (_.isNil(user)) {
      return res.status(400).send({success: false, message: 'User does not exist'})
    }

    await updatePassword({
      userName: newUserFormBody.userName,
      password: newUserFormBody.password,
    })

    res.sendStatus(200)
  } catch (err) {
    return res.status(500).json({success: false, message: err.message})
  }
});


module.exports = router;
