'use strict';
// const config = require('../../config');
const mongoose = require('mongoose');
const { questionSchemaString } = require('../models/question');
// const Joi = require('joi');
// const _ = require('lodash')

const Question = mongoose.model(questionSchemaString);

// const joiGroupSchema = Joi.object().keys({
//   groupName: Joi.string().min(1).max(30).required(),
//   groupContact: Joi.string().min(1).max(30).required(),
//   invitationCode: Joi.string().required(),
// });


async function getAllQuestions() {
  return Question.find({})
}

module.exports = {
  // joiGroupSchema,
  getAllQuestions,
}