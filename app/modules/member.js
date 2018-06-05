'use strict';
// const config = require('../../config');
const mongoose = require('mongoose');
const { memberSchemaString } = require('../models/member');
const _ = require('lodash')

const Member = mongoose.model(memberSchemaString);


async function findMemberByUsername({ userName }) {
  return await Member.findOne({userName})
}

async function getMemberGroupInfo({ userName }){
  const query = Member.findOne({
    userName,
  })
  let member = await Member.populateGroup(query)
  if (_.isNil(member)) {
    return
  }
  let group = member.group
  group = group.toObject()
  if (!member.isLeader) {
    delete group['invitation_code']
  }
  return group;
}

async function getGroupMemberList({ groupName }) {
  const query = Member.find({
    groupName,
  })
  const memberList = await Member.populateUser(query)
  const memberNickNameList = _.map(memberList, (m) => m.user.nickName)
  return memberNickNameList

}

async function createLeader({ groupName, userName }) {
  const newMember = new Member({groupName, userName, isLeader: true})
  return newMember.save()
}

async function createMember({ groupName, userName }) {
  const newMember = new Member({groupName, userName, isLeader: false})
  return newMember.save()
}

module.exports = {
  createLeader,
  createMember,
  findMemberByUsername,
  getGroupMemberList,
  getMemberGroupInfo,
}