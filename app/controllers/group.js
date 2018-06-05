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
  findGroupByInvitationCode,
} = require('../modules/group')
const {
  createLeader,
  createMember,
  findMemberByUsername,
  getMemberGroupInfo,
  getGroupMemberList,
} = require('../modules/member')


router.get('/info', async function(req, res) {
  const { userName } = req.decodedToken

  try {
    const group = await getMemberGroupInfo({ userName })
    let memberList
    if (!_.isNil(group)) {
      const { groupName } = group
      memberList = await getGroupMemberList({groupName})
    }
    return res.status(200).send({groupInfo: group, memberList: memberList})
  } catch (err) {
    return res.status(500).send({ message: 'Something went wrong'})
  }
})

router.post('/join', async function(req, res) {
  const { invitationCode } = req.body
  const { userName } = req.decodedToken
  try {
    const member = await findMemberByUsername({
      userName,
    })
    if (!_.isNil(member)) {
      return res.status(400).send({message: '该成员已经有队伍了'})
    }

    const group = await findGroupByInvitationCode({invitationCode})
    if (_.isNil(group)) {
      return res.status(400).send({message: 'Group does not exist'})
    }
    const { groupName } = group
    const memberList = await getGroupMemberList({groupName})
    if (memberList.length >= 5) {
      return res.status(400).send({message: 'Maximum 5 people for a group'})
    }
    await createMember({ groupName, userName })
    res.sendStatus(200)
  } catch(err) {
    console.log(err)
    res.status(500).send({message: 'Error joining group'})
  }

})

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
    // validation
    const groupByName = await findGroupByGroupName({ groupName })
    if (!_.isNil(groupByName)) {
      return res.status(400).send({message: '队伍名已被占用'})
    }

    // TODO
    const groupByInvitation = await findGroupByInvitationCode({
      invitationCode,
    })
    if (!_.isNil(groupByInvitation)) {
      return res.status(400).send({message:'请重试'})
    }

    const member = await findMemberByUsername({
      userName,
    })
    if (!_.isNil(member)) {
      return res.status(400).send({ message: '该成员已经有队伍了'})
    }

    await createGroup(reqBody)
    await createLeader({ groupName, userName })
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send({message: err.message})
  }

})

module.exports = router