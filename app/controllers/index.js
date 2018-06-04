'use strict';
module.exports = function (app) {
  const express = require('express');

  const apiRouter = express.Router();
  app.use('/api', apiRouter);

  apiRouter.get('/hello', async function(req, res) {
    res.send('Hello World');
  });

  // Public routes
  const auth = require('./auth');
  apiRouter.use('/auth', auth)

  // Private routes
  const authorization = require('../middlewares/auth');
  apiRouter.use(authorization.requiresLogin);

  const session = require('./session');
  apiRouter.use('/session', session)

  // apiRouter.use(authErrorHandler)
};