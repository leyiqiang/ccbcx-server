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
});


async function getAllQuestions() {
  return Question.find({})
}

async function getQuestionsByGroupTypes({ groupTypes }) {
  const questionList =  await Question.find({
    $or: (groupTypes),
  })
  const questionListWithoutAnswer = _.map(questionList, (q) => {
    const questionWithoutAnswer = q.toObject()
    delete q.answer
    return questionWithoutAnswer
  })
  return questionListWithoutAnswer
}

async function getQuestion({questionNumber}) {
  return Question.findOne({questionNumber})
}

async function updateQuestion({questionNumber, questionContent, answer}) {
  return Question.findOneAndUpdate({
    questionNumber,
  }, {
    questionContent,
    answer,
  })
}

module.exports = {
  joiQuestionSchema,
  getQuestionsByGroupTypes,
  updateQuestion,
  getQuestion,
  getAllQuestions,
}