'use strict';
// const config = require('../../config');
const mongoose = require('mongoose');
const { progressSchemaString } = require('../models/progress');
const Joi = require('joi');
// const _ = require('lodash')

const Progress = mongoose.model(progressSchemaString);

const joiProgressSchema = Joi.object().keys({
  questionNumber: Joi.string().min(1).max(3).required(),
  answer: Joi.string(),
});


async function getProgress({ groupName, questionNumber }) {
  const progress =  await Progress.findOne({
    groupName,
    questionNumber,
  })
  return progress
}

async function getProgressListByQuestion({questionNumber}) {
  const progressList = await Progress.find({
    questionNumber,
  })
  return progressList
}

async function getProgressListByGroup({groupName}) {
  const progressList = await Progress.find({
    groupName,
  })
  return progressList
}

async function getProgressList() {
  const progressList = await Progress.find({})
  return progressList
}

async function updateProgress({groupName, questionNumber, answer, score, completeTime}) {
  return Progress.findOneAndUpdate({
    groupName,
    questionNumber,
  },
  {
    $push:{answerHistory: answer},
    score,
    completeTime,
  },
  {
    upsert: true,
  },
  )
}

async function getCompletedProgressList({groupName}) {
  return Progress.find({
    groupName,
    completeTime: {$ne: null},
  })
}



module.exports = {
  updateProgress,
  joiProgressSchema,
  getProgress,
  getProgressListByQuestion,
  getProgressListByGroup,
  getProgressList,
  getCompletedProgressList,
}