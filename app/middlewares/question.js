'use strict';
const _ = require('lodash')
const { findMemberByUsername } = require('../modules/member')
const moment = require('moment')
const { getQuestion } = require('../modules/question')


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
  let { questionNumber } = req.params
  if (_.isNil(questionNumber)) {
    questionNumber = req.body.questionNumber
  }
  console.log(questionNumber)
  try {
    let question = await getQuestion({questionNumber})
    if (moment(question.questionGroup.releaseTime).isAfter(moment())) {
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