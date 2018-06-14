'use strict';
const mongoose = require('mongoose');
const { questionGroupSchemaString } = require('../models/questionGroup');
const Joi = require('joi');
// const _ = require('lodash')
const { GROUP_ONE, GROUP_TWO, GROUP_THREE, GROUP_META } = require('../models/questionGroup')
const QuestionGroup = mongoose.model(questionGroupSchemaString);

const joiQuestionGroupSchema = Joi.object().keys({
  groupType: Joi.number().valid(GROUP_ONE, GROUP_TWO, GROUP_THREE, GROUP_META),
  groupName: Joi.string().min(1).max(10).required(),
  releaseTime: Joi.date(),
});

async function getQuestionGroupList() {
  return QuestionGroup.find({})
}

async function getQuestionGroupByDate() {
  const now = new Date()
  return QuestionGroup.find({
    releaseTime: {$lt: now},
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