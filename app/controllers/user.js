'use strict'

const express = require('express')
const router = express.Router();
const _ = require('lodash')
const uuidv4 = require('uuid/v4');
const Joi = require('joi');
const { sendJoiValidationError } = require('../utils/joi');
const {
  joiGroupSchema,
  createGroup,
  findGroupByGroupName,
} = require('../modules/group')
const {
  createLeader,
} = require('../modules/member')

// const { getUserByUserName } = require('../modules/user')


// router.get('/:userName', async function(req, res) {
//   const { userName } = req.params
//
//   try {
//     const user = await userModule.getUserByUserName({ userName })
//     return res.status(200).send(user)
//   } catch (err) {
//     return res.status(500).send({ message: 'Something went wrong'})
//   }
// })

router.post('/create', async function(req, res) {
  const { userName } = req.decodedToken
  const invitationCode = uuidv4()
  const fieldList = ['groupName', 'groupContact']

  // validate req body
  let reqBody = _.pick(req.body, fieldList)
  reqBody.invitationCode = invitationCode

  const joiResult = Joi.validate(reqBody, joiGroupSchema, {
    presence: 'required',
    abortEarly: false,
  })
  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }

  try {
    const { groupName } = reqBody
    const group = await findGroupByGroupName({ groupName })
    if (!_.isNil(group)) {
      return res.status(400).send({message: '队伍名已被占用'})
    }
    await createGroup(reqBody)
    await createLeader({ groupName, userName })
  } catch (err) {
    console.log(err)
    res.status(500).send({message: err.message})
  }

})

module.exports = router