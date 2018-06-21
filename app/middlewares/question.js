'use strict';
const _ = require('lodash')
const { findMemberByUsername } = require('../modules/member')


const requiresTeam = async function(req, res, next) {
  const { userName } = req.decodedToken
  try {
    const member = await findMemberByUsername({
      userName,
    })
    if (_.isNil(member)) {
      return res.status(400).send({message: '需要队伍'})
    }
    req.member = member
    return next()
  } catch(err) {
    return res.status(500).send({message: err.message})
  }

}

module.exports = {
  requiresTeam,
};