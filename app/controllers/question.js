'use strict';

const express = require('express');
const _ = require('lodash')
const router = express.Router();
const {
  getQuestionsByGroupTypes,
  getQuestion,
} = require('../modules/question')
const { findMemberByUsername } = require('../modules/member')
const { getQuestionGroupByDate } = require('../modules/questionGroup')

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
    const questionList = await getQuestionsByGroupTypes({ groupTypes })
    return res.status(200).send(questionList)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
});


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

    let question = await getQuestion({ questionNumber })
    question = question.toObject()
    question.questionContent = questionContent
    return res.status(200).send(question)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

module.exports = router;