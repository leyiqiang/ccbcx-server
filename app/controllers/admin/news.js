'use strict';

const express = require('express');
const _ = require('lodash')
const Joi = require('joi');
const { sendJoiValidationError } = require('../../utils/joi');
const { addNews, getNews, joiNewsSchema, deleteNews } = require('../../modules/news')
// const moment = require('moment')
const router = express.Router()

const {requiresAdminCredential} = require('../../middlewares/auth')
router.use(requiresAdminCredential)

router.post('/create', async function(req, res) {
  const fieldList = ['message']
  const newsFormBody = _.pick(req.body, fieldList)
  const joiResult = Joi.validate(newsFormBody, joiNewsSchema, {
    presence: 'required',
    abortEarly: false,
  })
  const joiError = joiResult.error
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res)
  }
  const message = newsFormBody.message
  try {
    const news = await addNews({message})
    return res.status(200).send(news)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

router.get('/list', async function(req, res) {
  try {
    const newsList = await getNews()
    return res.status(200).send(newsList)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

router.delete('/:newsId', async function(req, res) {
  try {
    const { newsId } = req.params
    await deleteNews({_id: newsId})
    return res.sendStatus(200)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
})

module.exports = router;
