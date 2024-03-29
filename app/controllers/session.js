'use strict';

const express = require('express');
const userModule = require('../modules/user');

const router = express.Router();

const authorization = require('../middlewares/auth')
router.use(authorization.requiresLogin)

router.get('/info', async function (req, res) {
  const { userName } = req.decodedToken;
  try {
    const user = await userModule.getUserByUserName({ userName });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
});

router.get('/:userName', async function (req, res) {
  const { userName } = req.params;

  try {
    const user = await userModule.getUserByUserName({ userName });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }

});

module.exports = router;
