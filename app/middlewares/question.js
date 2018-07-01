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
    // check quesiton release
    const fakeMetaProgress = await getProgress({
      groupName: member.groupName,
      questionNumber: 'MM',
    })
    let question = await getQuestion({questionNumber})
    if (_.isNil(question)) {
      return res.status(404).send({message: 'Question does not exist.'})
    }
    if(question.questionGroup.groupType >= 5) {
      console.log(fakeMetaProgress)
      if(_.isNil(fakeMetaProgress) || _.isNil(fakeMetaProgress.completeTime)) {
        return res.status(404).send({message: 'Question does not exist.'})
      }
    }
    if (moment(question.questionGroup.releaseTime).isAfter(moment().utc())) {
      return res.status(403).send({message: 'You are not allowed to do this.'})
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