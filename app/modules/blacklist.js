'use strict';
const mongoose = require('mongoose');
const { blackListSchemaString } = require('../models/blacklist');
const BlackList = mongoose.model(blackListSchemaString);
const Joi = require('joi');
// const _ = require('lodash')


const joiBlackListSchema = Joi.object().keys({
  groupName: Joi.string().min(1).max(30).required(),
  seconds: Joi.number().min(0).required(),
});


async function getBlackList({ groupName }) {
  const blacklist =  await BlackList.findOne({
    groupName,
  })
  return blacklist
}

async function removeBlackList({ groupName }) {
  return await BlackList.findOneAndDelete({
    groupName,
  })
}

async function addBlackList({ groupName, blockedUntil }) {
  return await BlackList.findOneAndUpdate({
    groupName,
  }, {
    blockedUntil,
  }, {
    upsert: true,
  })
}



module.exports = {
  getBlackList,
  removeBlackList,
  addBlackList,
  joiBlackListSchema,
}