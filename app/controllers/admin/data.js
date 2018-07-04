'use strict';

const express = require('express')
// const _ = require('lodash')
const {
  getProgressListByQuestion,
  getProgressListByGroup,
  getProgressList,
} = require('../../modules/progress')
const router = express.Router();

const {requiresAdminCredential} = require('../../middlewares/auth')
router.use(requiresAdminCredential)

router.get('/group/:groupName', async function(req, res) {
  const { groupName } = req.params
  try {
    const progressList = await getProgressListByGroup({ groupName })
    return res.status(200).send(progressList)
  } catch (err) {
    return res.status(500).send({message: err.message})
  }
})

router.get('/question/:questionNumber', async function(req, res) {
  const { questionNumber } = req.params
  try {
    const progressList = await getProgressListByQuestion({ questionNumber })
    return res.status(200).send(progressList)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }

})

router.get('/list', async function(req, res) {
  try {
    const progressList = await getProgressList()
    return res.status(200).send(progressList)
  } catch(err) {
    return res.status(500).send({message: err.message})
  }
})


module.exports = router;
