'use strict';

const express = require('express');
const userModule = require('../modules/user');

const router = express.Router();

router.post('/signIn', async function (req, res) {
  try {
    const { userName, password } = req.body.userName;
    const user = await userModule.getUserByUserName({ userName })
    if (!user) {
      return res.status(404).send('User does not exist.')
    }
    const isValidPassword = user.authenticate(password)
    if (!isValidPassword) {
      return res.status(401).send({ auth: false, token: null })
    }
    const token = userModule.generateJwtTokenForUser({
      userName: user.userName,
    })
    res.status(200).send({ auth:true, token: token })
  } catch (err) {
    return res.sendStatus(500)
  }
});

module.exports = router;
