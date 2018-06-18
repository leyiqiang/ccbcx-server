'use strict';

const express = require('express');
const _ = require('lodash')
const Joi = require('joi');
var sanitizeHtml = require('sanitize-html');
const { sendJoiValidationError } = require('../../utils/joi');
const router = express.Router();
const {
  getAllQuestions,
  getQuestion,
  updateQuestion,
  joiQuestionSchema,
} = require('../../modules/question')

const config = require('../../../config')
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: config.aws_access,
  secretAccessKey: config.aws_secret,
})
const BUCKET_NAME = 'ccbcx'
const s3 = new AWS.S3()

const authorization = require('../../middlewares/auth')

router.use(authorization.checkAdminJwt)

router.get('/list',async function(req, res) {
  try {
    const questionList = await getAllQuestions()
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
router.post('/updateLocation', async function(req, res) {
  const {questionNumber, location} = req.body
  return res.sendStatus(200)

})

router.post('/update', async function(req, res) {
  const fieldList = ['questionNumber', 'answer', 'hint1', 'hint2', 'hint3']
  const newQuestionFormBody = _.pick(req.body, fieldList)

  const joiResult = Joi.validate(newQuestionFormBody, joiQuestionSchema, {
    presence: 'required',
    abortEarly: false,
  })

  const questionContent = req.body.questionContent

  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }

  const sanitizedContent = sanitizeHtml(
      questionContent, {
        allowedTags: false,
        allowedAttributes: false,
        allowedSchemesByTag: {
          img: [ 'data' ],
        },
      })

  try{
    await s3.upload({
      Bucket:BUCKET_NAME,
      Key: newQuestionFormBody.questionNumber + '.txt',
      Body: sanitizedContent,
    }).promise()
    const question = await updateQuestion({
      questionNumber: newQuestionFormBody.questionNumber,
      answer: newQuestionFormBody.answer,
      hint1: newQuestionFormBody.hint1,
      hint2: newQuestionFormBody.hint2,
      hint3: newQuestionFormBody.hint3,
    })
    res.status(200).send(question)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
})
module.exports = router;