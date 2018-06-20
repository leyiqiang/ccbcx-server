'use strict';

const express = require('express');
const _ = require('lodash')
const Joi = require('joi');
const router = express.Router();
const {
  getQuestionsByGroupTypes,
  getQuestionWithoutAnswer,
  getQuestion,
} = require('../modules/question')
const { findMemberByUsername } = require('../modules/member')
const { getQuestionGroupByDate } = require('../modules/questionGroup')
const {getProgress, updateProgress, joiProgressSchema} = require('../modules/progress')
const { sendJoiValidationError } = require('../utils/joi');

const config = require('../../config')
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: config.aws_access,
  secretAccessKey: config.aws_secret,
})
const BUCKET_NAME = 'ccbcx-fake'
const s3 = new AWS.S3()


const authorization = require('../middlewares/auth')
router.use(authorization.requiresLogin)

router.get('/list',async function(req, res) {
  const { userName } = req.decodedToken
  try {
    const member = await findMemberByUsername({
      userName,
    })
    if (_.isNil(member)) {
      return res.status(400).send({message: '你需要队伍才能查看题目相关信息'})
    }
    const questionGroupList = await getQuestionGroupByDate()
    const groupTypes = _.map(questionGroupList, (g) => {
      return {groupType: g.groupType}
    })
    if (groupTypes.length === 0) {
      return res.status(200).send([])
    }
    const questionList = await getQuestionsByGroupTypes({ groupTypes })
    return res.status(200).send(questionList)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
});

router.post('/answer', async function(req, res) {
  const { userName } = req.decodedToken
  const fieldList = ['questionNumber', 'answer']
  const newProgressFormBody = _.pick(req.body, fieldList)

  // validate user input
  const joiResult = Joi.validate(newProgressFormBody, joiProgressSchema, {
    presence: 'required',
    abortEarly: false,
  })
  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }
  const { questionNumber, answer } = newProgressFormBody

  try {
    const member = await findMemberByUsername({
      userName,
    })
    if (_.isNil(member)) {
      return res.status(400).send({message: '需要队伍'})
    }
    const progress = await getProgress({
      groupName: member.groupName,
      questionNumber,
    })

    // check progress
    if(!_.isNil(progress)) {
      console.log(progress)
      if (_.includes(progress.answerHistory, answer)) {
        return res.status(400).send({message: 'you already answered that'})
      }
      if (!_.isNil(progress.completeTime)) {
        return res.status(400).
            send({message: 'you already completed the question'})
      }
    }

    // verify answer
    const question = await getQuestion({ questionNumber })
    if(question.answer === answer) {
      await updateProgress({
        groupName: member.groupName,
        questionNumber,
        answer,
        completeTime: new Date(),
      })
      return res.status(200).send({message: 'correct answer'})
    } else {
      await updateProgress({
        groupName: member.groupName,
        questionNumber,
        answer,
        completeTime: null,
      })
      // todo blacklist
      return res.status(200).send({message: 'wrong answer'})
    }
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})


router.get('/:questionNumber', async function(req, res) {
  try {
    const { questionNumber } = req.params
    const params =  {
      Bucket: BUCKET_NAME,
      Key: questionNumber + '.txt',
    }
    let questionContent
    try {
      const data = await s3.getObject(params).promise()
      questionContent = data.Body.toString()
    } catch (headErr) {
      if (headErr.statusCode === 404) {
        questionContent = ''
      }
    }

    let question = await getQuestionWithoutAnswer({ questionNumber })
    question = question.toObject()
    delete question['answer']
    question.questionContent = questionContent
    return res.status(200).send(question)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

router.get('/progress/:questionNumber', async function(req, res) {
  try {
    const { userName } = req.decodedToken
    const { questionNumber } = req.params
    const member = await findMemberByUsername({
      userName,
    })
    if (_.isNil(member)) {
      return res.status(400).send({message: '需要队伍'})
    }
    const progress = await getProgress({
      groupName: member.groupName,
      questionNumber,
    })
    return res.status(200).send(progress)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

module.exports = router;