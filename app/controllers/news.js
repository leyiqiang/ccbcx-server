'use strict';

const express = require('express');
// const _ = require('lodash')
// const moment = require('moment')
const router = express.Router()
const { getNews } = require('../modules/news')

const authorization = require('../middlewares/auth')
router.use(authorization.requiresLogin)

router.get('/list', async function(req, res) {
  try {
    const newsList = await getNews()
    return res.status(200).send(newsList)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})

module.exports = router;
