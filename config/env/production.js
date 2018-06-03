'use strict';

/**
 * Expose
 */

module.exports = {
  secret: process.env.SESSION_SECRET,
  mongodb: process.env.MONGO_DB_URI,
};