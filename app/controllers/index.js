'use strict'

module.exports = function (app) {
  const express = require('express')
  const { authErrorHandler } = require('../middlewares/errorHandler')

  const apiRouter = express.Router()
  app.use('/api', apiRouter)

  apiRouter.get('/pikachu', async function(req, res) {
    res.send('感谢你对密码吧的支持! --皮卡')
  })

  // Public routes
  const auth = require('./auth')
  apiRouter.use('/auth', auth)

  // Private routes
  const session = require('./session')
  apiRouter.use('/session', session)

  const group = require('./group')
  apiRouter.use('/group', group)

  const admin_session = require('./admin/session')
  apiRouter.use('/admin/session', admin_session)

  const admin_group = require('./admin/group')
  apiRouter.use('/admin/group', admin_group)

  apiRouter.use(authErrorHandler)
}