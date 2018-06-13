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
    const question = await getQuestion({ questionNumber })
    return res.status(200).send(question)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

router.post('/update', async function(req, res) {
  const fieldList = ['questionNumber', 'questionContent', 'answer']
  const newQuestionFormBody = _.pick(req.body, fieldList)

  const joiResult = Joi.validate(newQuestionFormBody, joiQuestionSchema, {
    presence: 'required',
    abortEarly: false,
  })

  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }

  const sanitizedContent = sanitizeHtml(
      newQuestionFormBody.questionContent, {
        allowedTags: false,
        allowedAttributes: false,
        allowedSchemesByTag: {
          img: [ 'data' ],
        },
      })

  try{
    const question = await updateQuestion({
      questionNumber: newQuestionFormBody.questionNumber,
      questionContent: sanitizedContent,
      answer: newQuestionFormBody.answer,
    })
    res.status(200).send(question)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
})
module.exports = router;