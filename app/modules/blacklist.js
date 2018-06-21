'use strict';
const mongoose = require('mongoose');
const { blackListSchemaString } = require('../models/blacklist');
const BlackList = mongoose.model(blackListSchemaString);

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
}