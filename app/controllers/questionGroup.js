'use strict';

const express = require('express');
// const userModule = require('../../modules/user');
const _ = require('lodash')
const router = express.Router();
const {
  getQuestionGroupByDate,
  getQuestionGroup,
} = require('../modules/questionGroup')
const {
  findMemberByUsername,
} = require('../modules/member')
const authorization = require('../middlewares/auth')
router.use(authorization.requiresLogin)

router.get('/list', async function (req, res) {

  const { userName } = req.decodedToken
  try {
    const member = await findMemberByUsername({
      userName,
    })
    if (_.isNil(member)) {
      return res.status(400).send({message: '你需要队伍才能查看题目相关信息'})
    }
    const questionGroupList = await getQuestionGroupByDate()
    const sortedList = _.sortBy(questionGroupList, ['groupType'])
    if(sortedList.length < 3) {
      const nextQuestionGroup = await getQuestionGroup({
        groupType: sortedList.length+1,
      })
      return res.status(200).send({
        questionGroupList: sortedList,
        nextReleaseTime: nextQuestionGroup.releaseTime,
      })
    }
    return res.status(200).send({questionGroupList: sortedList})
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
});

module.exports = router;
