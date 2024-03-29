'use strict';

const express = require('express');
const _ = require('lodash')
const Joi = require('joi');
const moment = require('moment')
const router = express.Router();
const {
  getQuestionsByGroupTypes,
  getQuestion,
} = require('../modules/question')

const { addBlackList } = require('../modules/blacklist')
const { getQuestionGroupByDate } = require('../modules/questionGroup')
const {
  getProgress,
  updateProgress,
  getCompletedProgressList,
  joiProgressSchema,
} = require('../modules/progress')
const { sendJoiValidationError } = require('../utils/joi');
const { calculateScore, filterHint } = require('../utils/question')

const config = require('../../config')
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: config.aws_access,
  secretAccessKey: config.aws_secret,
})
const BUCKET_NAME = 'ccbcx-fake'
const s3 = new AWS.S3()

const { requiresTeam, requiresRelease } = require('../middlewares/question')
const { checkBlackList } = require('../middlewares/blacklist')
const { getMaxGroupType } = require('../utils/question')
const authorization = require('../middlewares/auth')

router.use(authorization.requiresLogin)
router.use(requiresTeam)

router.get('/list', async function(req, res) {
  const member = req.member
  try {
    const maxGroupType = await getMaxGroupType({member})
    const questionGroupList = await getQuestionGroupByDate({maxGroupType})
    // todo send completed
    await getCompletedProgressList({
      groupName: member.groupName,
    })
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

router.post('/answer', checkBlackList, requiresRelease, async function(req, res) {
  const member = req.member
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
    const progress = await getProgress({
      groupName: member.groupName,
      questionNumber,
    })

    // check progress
    if(!_.isNil(progress)) {
      if (_.includes(progress.answerHistory, answer)) {
        return res.status(400).send({message: '你已经回答过这个答案了'})
      }
      if (!_.isNil(progress.completeTime)) {
        return res.status(400).
            send({message: '你已经完成这个题目了'})
      }
    }

    // verify answer
    const question = await getQuestion({ questionNumber })
    if(question.answer === answer) {
      const { groupType, releaseTime } = question.questionGroup
      const score = await calculateScore({ groupType, releaseTime, questionNumber })
      await updateProgress({
        groupName: member.groupName,
        questionNumber,
        answer,
        score,
        completeTime: moment.utc().toDate(),
      })
      return res.status(200).send({message: '回答正确'})
    } else {
      await updateProgress({
        groupName: member.groupName,
        questionNumber,
        answer,
        completeTime: null,
      })
      // add to black list, block to 1 minute
      const blockedUntil = moment().utc().add(60, 'seconds').toDate()
      await addBlackList({
        groupName: member.groupName,
        blockedUntil,
      })
      return res.status(200).send({message: '回答错误'})
    }
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

router.get('/:questionNumber', requiresRelease, async function(req, res) {
  try {
    const { questionNumber } = req.params
    let question = await getQuestion({ questionNumber })
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
    question = question.toObject()
    delete question['answer']
    question.questionContent = questionContent
    question = filterHint({question})
    return res.status(200).send(question)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

router.get('/progress/:questionNumber', requiresRelease, async function(req, res) {
  try {
    const { questionNumber } = req.params
    const member = req.member
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