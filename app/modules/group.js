'use strict';
// const config = require('../../config');
const mongoose = require('mongoose');
const { groupSchemaString } = require('../models/group');
const Joi = require('joi');
const _ = require('lodash')

const Group = mongoose.model(groupSchemaString);

const joiGroupSchema = Joi.object().keys({
  groupName: Joi.string().alphanum().min(1).max(30).required(),
  groupContact: Joi.string().min(1).max(30).required(),
  invitationCode: Joi.string().required(),
});


async function findGroupByGroupName({ groupName }) {
  return Group.findOne({ groupName })
}

async function createGroup({ groupName, groupContact, invitationCode }) {
  // TODO
  const group = await Group.findOne({
    invitationCode,
  })
  if (!_.isNil(group)) {
    throw new Error('请重试')
  }
  const newGroup = new Group({ groupName, groupContact, invitationCode})
  return newGroup.save()
}


module.exports = {
  joiGroupSchema,
  findGroupByGroupName,
  createGroup,
}