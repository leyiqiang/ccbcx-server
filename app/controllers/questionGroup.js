'use strict';

const express = require('express');
// const userModule = require('../../modules/user');
const _ = require('lodash')
const router = express.Router();
const {
  getQuestionGroupByDate,
  getQuestionGroup,
} = require('../modules/questionGroup')
const {requiresTeam} = require('../middlewares/question')
const { getMaxGroupType } = require('../utils/question')
const authorization = require('../middlewares/auth')
router.use(authorization.requiresLogin)

router.get('/list', requiresTeam, async function (req, res) {
  const member = req.member
  try {
    const maxGroupType = await getMaxGroupType({member})
    const questionGroupList = await getQuestionGroupByDate({maxGroupType})

    const sortedList = _.sortBy(questionGroupList, ['groupType'])
    let lastGroupType
    if (sortedList.length !== 0) {
      lastGroupType = _.last(sortedList).groupType
    } else {
      lastGroupType = 0
    }
    if(lastGroupType < 3) {
      const nextQuestionGroup = await getQuestionGroup({
        groupType: lastGroupType + 1,
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
