'use strict';

const express = require('express');
// const userModule = require('../../modules/user');
// const _ = require('lodash')
const router = express.Router();
const {
  getQuestionGroupList,
} = require('../../modules/question')

const authorization = require('../../middlewares/auth')
router.use(authorization.checkAdminJwt)

router.get('/groupList', async function (req, res) {
  try {
    const questionGroupList = await getQuestionGroupList()
    return res.status(200).send(questionGroupList)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
});


module.exports = router;
