'use strict';
const mongoose = require('mongoose');
const { questionGroupSchemaString } = require('../models/questionGroup');
const Joi = require('joi');
const moment = require('moment')
const { GROUP_ONE, GROUP_TWO, GROUP_THREE, GROUP_SMALLMETA, GROUP_META, GROUP_METAMETA } = require('../models/questionGroup')
const QuestionGroup = mongoose.model(questionGroupSchemaString);

const joiQuestionGroupSchema = Joi.object().keys({
  groupType: Joi.number().valid(GROUP_ONE, GROUP_TWO, GROUP_THREE, GROUP_SMALLMETA, GROUP_META, GROUP_METAMETA),
  groupName: Joi.string().min(1).max(10).required(),
  releaseTime: Joi.date(),
});

async function getQuestionGroupList() {
  return QuestionGroup.find({})
}

async function getQuestionGroupByDate() {
  const now = moment.utc().toDate()
  return QuestionGroup.find({
    releaseTime: {$lt: now},
    groupType: {$lt: 4},
  })
}

async function getQuestionGroup({ groupType }) {
  return QuestionGroup.findOne({ groupType })
}

async function updateQuestionGroup({ groupType, groupName, releaseTime }) {
  return QuestionGroup.findOneAndUpdate({
    groupType,
  }, {
    groupName,
    releaseTime,
  })
}

module.exports = {
  updateQuestionGroup,
  getQuestionGroupByDate,
  joiQuestionGroupSchema,
  getQuestionGroupList,
  getQuestionGroup,
}