'use strict';
const mongoose = require('mongoose');
const { questionGroupSchemaString } = require('../models/questionGroup');
// const Joi = require('joi');
// const _ = require('lodash')

const QuestionGroup = mongoose.model(questionGroupSchemaString);


async function getQuestionGroupList() {
  return QuestionGroup.find({})
}

module.exports = {
  getQuestionGroupList,
}