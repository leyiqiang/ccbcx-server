'use strict';

const express = require('express');
const adminUserModule = require('../../modules/adminUser');

const router = express.Router();

const {requiresAdminCredential} = require('../../middlewares/auth')
router.use(requiresAdminCredential)

router.get('/info', async function (req, res) {
  const { userName } = req.decodedToken;
  try {
    const user = await adminUserModule.getUserByUserName({ userName });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
});

router.get('/:userName', async function (req, res) {
  const { userName } = req.params;

  try {
    const user = await adminUserModule.getUserByUserName({ userName });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }

});

module.exports = router;
