'use strict';
const _ = require('lodash')
const { getBlackList, removeBlackList } = require('../modules/blacklist')
const moment = require('moment')

const checkBlackList = async function(req, res, next) {
  const member = req.member
  try {
    const blackList = await getBlackList({
      groupName: member.groupName,
    })
    if (!_.isNil(blackList)) {
      const { blockedUntil } = blackList
      if (moment(blockedUntil).isBefore(moment())) {
        await removeBlackList({
          groupName: member.groupName,
        })
        return next()
      } else {
        const diff = moment.duration(moment(blockedUntil).diff(moment()))
        const seconds = parseInt(diff.asSeconds())
        return res.status(400).send({message: 'Release from blacklist in ' + seconds + 'seconds'})
      }
    }
    return next()
  } catch(err) {
    return res.status(500).send({message: err.message})
  }

}

module.exports = {
  checkBlackList,
};