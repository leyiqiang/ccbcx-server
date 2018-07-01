const moment = require('moment')

const TIME_INTERVAL = 300
const {getProgressListByQuestion, getProgress} = require('../modules/progress')
const { GROUP_METAMETA, GROUP_META } = require('../models/questionGroup')
const _ = require('lodash')

async function calculateScore ({groupType, releaseTime, questionNumber}) {
  const diff = calculateTimeDiff({releaseTime})
  switch (groupType) {
    case 1:
    case 2:
    case 3:
      if (diff <= TIME_INTERVAL) {
        return 10
      } else if (TIME_INTERVAL < diff && diff <= TIME_INTERVAL * 2) {
        return 9
      } else if (TIME_INTERVAL * 2 < diff && diff <= TIME_INTERVAL * 3) {
        return 7
      } else {
        return 5
      }
    case 4:
      if (diff <= TIME_INTERVAL) {
        return 15
      } else if (TIME_INTERVAL < diff && diff <= TIME_INTERVAL * 2) {
        return 13
      } else if (TIME_INTERVAL * 2 < diff && diff <= TIME_INTERVAL * 3) {
        return 11
      } else {
        return 8
      }
    case 5:
      return 0;
    case 6: {
      const progressList = await getProgressListByQuestion({questionNumber})
      let bonus
      if (progressList.length <= 6)
        bonus = 30 - (progressList.length - 1) * 5
      if (diff < TIME_INTERVAL) {
        return 50 + bonus
      } else if (TIME_INTERVAL <= diff && diff < TIME_INTERVAL * 2) {
        return 47 + bonus
      } else if (TIME_INTERVAL * 2 <= diff && diff < TIME_INTERVAL * 3) {
        return 42 + bonus
      } else {
        return 36 + bonus
      }
    }
  }

}

const filterHint = ({question}) => {
  const { releaseTime } = question.questionGroup
  const diff = calculateTimeDiff({releaseTime})
  if(diff <= TIME_INTERVAL * 3) {
    delete question['hint3']
  }
  if (diff <= TIME_INTERVAL * 2) {
    delete question['hint2']
  }
  if (diff <= TIME_INTERVAL ) {
    delete question['hint1']
  }
  return question
}

const calculateTimeDiff = ({releaseTime}) => {
  const duration = moment.duration(moment().utc().diff(moment(releaseTime)))
  return duration.asSeconds()
}

const getMaxGroupType = async function({member}) {
  const fakeMetaProgress = await getProgress({
    groupName: member.groupName,
    questionNumber: 'MM',
  })
  if(!_.isNil(fakeMetaProgress) && !_.isNil(fakeMetaProgress.completeTime)) {
    return GROUP_METAMETA
  } else {
    return GROUP_META
  }
}

module.exports = {
  calculateScore,
  filterHint,
  getMaxGroupType,
}