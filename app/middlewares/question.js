'use strict';
const _ = require('lodash')
const { findMemberByUsername } = require('../modules/member')
const moment = require('moment')
const { getQuestion } = require('../modules/question')
const { getProgress } = require('../modules/progress')

const requiresTeam = async function(req, res, next) {
  const { userName } = req.decodedToken
  try {
    const member = await findMemberByUsername({
      userName,
    })
    if (_.isNil(member)) {
      return res.status(403).send({message: '需要队伍'})
    }
    req.member = member
    return next()
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
}

const requiresRelease = async function(req, res, next) {
  // TODO hard coded!!
  let { questionNumber } = req.params
  if (_.isNil(questionNumber)) {
    questionNumber = req.body.questionNumber
  }
  try {
    const member = req.member
    // check question release
    const fakeMetaProgress = await getProgress({
      groupName: member.groupName,
      questionNumber: 'MM',
    })
    let question = await getQuestion({questionNumber})
    if (_.isNil(question)) {
      return res.status(404).send({message: '该题目不存在.'})
    }
    // 如果MM没有解出来, 不显示之后的题目
    if(question.questionGroup.groupType >= 5) {
      if(_.isNil(fakeMetaProgress) || _.isNil(fakeMetaProgress.completeTime)) {
        return res.status(404).send({message: '该题目不存在.'})
      }
    }
    if (moment(question.questionGroup.releaseTime).isAfter(moment().utc())) {
      return res.status(403).send({message: '缺少权限.'})
    }
    return next()
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
}

module.exports = {
  requiresTeam,
  requiresRelease,
};