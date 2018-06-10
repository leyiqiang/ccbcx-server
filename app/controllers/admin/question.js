'use strict';

const express = require('express');
const _ = require('lodash')
// const Joi = require('joi');
// const { sendJoiValidationError } = require('../../utils/joi');
const router = express.Router();
const {
  getAllQuestions,
} = require('../../modules/question')

const authorization = require('../../middlewares/auth')
router.use(authorization.checkAdminJwt)

router.get('/list',async function(req, res) {
  try {
    const questionList = await getAllQuestions()
    const sortedList = _.sortBy(questionList, ['questionNumber'])
    return res.status(200).send(sortedList)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
});

module.exports = router;