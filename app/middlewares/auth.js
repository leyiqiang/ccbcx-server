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

const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkAdminJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://ccbcx.auth0.com/.well-known/jwks.json',
  }),
  // Validate the audience and the issuer.
  audience: 'https://ccbcx.auth0.com/api/v2/',
  issuer: 'https://ccbcx.auth0.com/',
  algorithms: ['RS256'],
});

module.exports = {
  requiresLogin,
  checkAdminJwt,
};