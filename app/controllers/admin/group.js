'use strict';

const express = require('express');
// const userModule = require('../../modules/user');
const _ = require('lodash')
const router = express.Router();
const {
  getAllGroups,
  findGroupByGroupName,
} = require('../../modules/group')

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

// router.get('/:groupName', async function (req, res) {
//   const { userName } = req.params;
//
//   try {
//     const user = await userModule.getUserByUserName({ userName });
//     return res.status(200).send(user);
//   } catch (error) {
//     return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//   }
//
// });

module.exports = router;
