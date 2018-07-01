'use strict';

const express = require('express')
const adminUserModule = require('../../modules/adminUser')
const router = express.Router();

router.post('/signIn', async function (req, res) {
  try {
    const { userName, password } = req.body;
    const user = await adminUserModule.getUser({ userName })
    if (!user) {
      return res.status(404).send({message: '用户不存在'})
    }
    const isValidPassword = user.authenticate(password)
    if (!isValidPassword) {
      return res.status(401).send({ auth: false, token: null, message: '密码不正确' })
    }
    const token = adminUserModule.generateJwtTokenForUser({
      userName: user.userName,
    })
    res.status(200).send({ auth:true, token: token })
  } catch (err) {
    return res.sendStatus(500)
  }
});


module.exports = router;
