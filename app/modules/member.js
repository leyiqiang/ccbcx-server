'use strict';
// const config = require('../../config');
const mongoose = require('mongoose');
const { memberSchemaString } = require('../models/member');
const _ = require('lodash')

const Member = mongoose.model(memberSchemaString);

async function createLeader({ groupName, userName}) {
  const user = await Member.getUserInfo({ userName })
  if (!_.isNil(user)) {
    throw new Error('该成员已经有队伍了')
  }
  return await Member.createLeader({ groupName, userName })

}
// async function createGroup({ groupName, groupContact, invitationCode }) {
//   const group = await Group.findOne({
//     invitationCode,
//   })
//   if (!_.isNil(group)) {
//     throw new Error('请重试')
//   }
//   const newGroup = new Group({ groupName, groupContact, invitationCode})
//   return newGroup.save()
// }


module.exports = {
  createLeader,
}