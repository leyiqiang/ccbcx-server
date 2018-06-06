'use strict';
// const config = require('../../config');
const mongoose = require('mongoose');
const { groupSchemaString } = require('../models/group');
const Joi = require('joi');
// const _ = require('lodash')

const Group = mongoose.model(groupSchemaString);

const joiGroupSchema = Joi.object().keys({
  groupName: Joi.string().min(1).max(30).required(),
  groupContact: Joi.string().min(1).max(30).required(),
  invitationCode: Joi.string().required(),
});


async function findGroupByGroupName({ groupName }) {
  return Group.findOne({ groupName })
}

async function findGroupByInvitationCode({ invitationCode }) {
  return Group.findOne({ invitationCode })
}

async function createGroup({ groupName, groupContact, invitationCode }) {
  const newGroup = new Group({ groupName, groupContact, invitationCode})
  return newGroup.save()
}

async function deleteGroup({ groupName }) {
  return Group.findOneAndDelete({ groupName })
}

module.exports = {
  joiGroupSchema,
  deleteGroup,
  findGroupByInvitationCode,
  findGroupByGroupName,
  createGroup,
}