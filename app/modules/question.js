'use strict';
// const config = require('../../config');
const mongoose = require('mongoose');
const { questionSchemaString } = require('../models/question');
const Joi = require('joi');
const _ = require('lodash')

const Question = mongoose.model(questionSchemaString);

const joiQuestionSchema = Joi.object().keys({
  questionNumber: Joi.string().min(1).max(3).required(),
  answer: Joi.string().min(1).max(30).required(),
  hint1: Joi.string().allow('').optional(),
  hint2: Joi.string().allow('').optional(),
  hint3: Joi.string().allow('').optional(),
});


async function getAllQuestions() {
  return Question.find({})
}

async function getQuestionsByGroupTypes({ groupTypes }) {
  const questionList =  await Question.find({
      $or: (groupTypes),
  })
  const questionListWithoutAnswer = _.map(questionList, (q) => {
    q = q.toObject()
    delete q['answer']
    return q
  })
  return questionListWithoutAnswer
}

async function getQuestion({questionNumber}) {
  const query = Question.findOne({questionNumber})
  return  await Question.populateGroup(query)
}

async function getQuestionByLocation({location}) {
  return Question.findOne({location})
}

async function updateQuestionLocation({questionNumber, location}) {
  return Question.findOneAndUpdate({
    questionNumber,
  }, {
    location,
  })
}

async function updateQuestion({questionNumber, questionContent, answer, hint1, hint2, hint3}) {
  return Question.findOneAndUpdate({
    questionNumber,
  }, {
    questionContent,
    answer,
    hint1,
    hint2,
    hint3,
  })
}

module.exports = {
  joiQuestionSchema,
  getQuestionsByGroupTypes,
  updateQuestion,
  getQuestion,
  getAllQuestions,
  getQuestionByLocation,
  updateQuestionLocation,
}