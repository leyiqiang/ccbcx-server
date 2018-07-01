'use strict';

const express = require('express');
const _ = require('lodash')
const Joi = require('joi');
const moment = require('moment')
const router = express.Router()
const {
  getAllGroups,
  findGroupByGroupName,
} = require('../../modules/group')
const { sendJoiValidationError } = require('../../utils/joi')

const {
  getBlackList,
  joiBlackListSchema,
  addBlackList,
  removeBlackList,
} = require('../../modules/blacklist')

const {
  getGroupMemberList,
} = require('../../modules/member')

const authorization = require('../../middlewares/auth')
router.use(authorization.checkAdminJwt)

router.get('/list', async function (req, res) {
  try {
    const groupList = await getAllGroups()
    return res.status(200).send(groupList)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
});

router.get('/info/:groupName', async function(req, res) {
  const { groupName } = req.params
  console.log(groupName +'asd')
  try {
    let memberList
    const group = await findGroupByGroupName({ groupName })
    if (!_.isNil(group)) {
      const { groupName } = group
      memberList = await getGroupMemberList({groupName})
    }
    return res.status(200).send({groupInfo: group, memberList: memberList})
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
})

router.get('/blacklist/:groupName', async function(req, res) {
  const { groupName } = req.params
  try {
    const blacklist = await getBlackList({ groupName })
    if (!_.isNil(blacklist) && moment(blacklist.blockedUntil).isBefore(moment().utc())) {
      await removeBlackList({
        groupName: groupName,
      })
    }
    return res.status(200).send({blacklist})
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
})


router.post('/addBlacklist', async function(req, res) {
  const fieldList = ['groupName', 'seconds']
  const newBlackListFormBody = _.pick(req.body, fieldList)

  const joiResult = Joi.validate(newBlackListFormBody, joiBlackListSchema, {
    presence: 'required',
    abortEarly: false,
  })


  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }
  const blockedUntil = moment.utc().add(newBlackListFormBody.seconds, 'seconds').toDate()
  const blacklist = await addBlackList({
    groupName: newBlackListFormBody.groupName,
    blockedUntil,
  })
  return res.status(200).send(blacklist)
})

router.delete('/removeBlacklist/:groupName', async function(req, res) {
  const { groupName } = req.params
  try {
    await removeBlackList({groupName})
    return res.sendStatus(200)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

module.exports = router;
