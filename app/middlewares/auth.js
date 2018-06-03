'use strict';

const userModule = require('../modules/user');
/*
 *  Generic require login routing middleware
 */
const requiresLogin = async function(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  }

  try {
    req.decodedToken = await userModule.decodeToken(token);
    return next();
  } catch (error) {
    return res.status(401).send({ auth: false, message: error.message });
  }
};

module.exports = {
  requiresLogin,
};