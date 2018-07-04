'use strict';

const express = require('express');
// const userModule = require('../../modules/user');
const _ = require('lodash')
const Joi = require('joi');
const { sendJoiValidationError } = require('../../utils/joi');
const router = express.Router();
const {
  getQuestionGroupList,
  updateQuestionGroup,
  joiQuestionGroupSchema,
} = require('../../modules/questionGroup')

const {requiresAdminCredential} = require('../../middlewares/auth')
router.use(requiresAdminCredential)

router.get('/list', async function (req, res) {
  try {
    const questionGroupList = await getQuestionGroupList()
    const sortedList = _.sortBy(questionGroupList, ['groupType'])
    return res.status(200).send(sortedList)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
});

router.put('/update', async function(req, res){
  const fieldList = ['groupType', 'groupName', 'releaseTime']
  const newQuestionGroupFormBody = _.pick(req.body, fieldList)

  const joiResult = Joi.validate(newQuestionGroupFormBody, joiQuestionGroupSchema, {
    presence: 'required',
    abortEarly: false,
  })

  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }

  try {
    const questionGroup = await updateQuestionGroup({
      groupType: newQuestionGroupFormBody.groupType,
      groupName: newQuestionGroupFormBody.groupName,
      releaseTime: newQuestionGroupFormBody.releaseTime,
    })

    return res.status(200).send(questionGroup)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

module.exports = router;
