const _ = require('lodash');

const requiredEnvList = [
  'SESSION_SECRET',
  'GITEE_ACCESS_TOKEN',
  'GITEE_USERNAME',
  'GITEE_REPOSITORY_NAME',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'MONGO_DB_URI',
];

function checkRequiredEnv() {
  const unsetEnv = _.filter(requiredEnvList, (envString) => {
    return _.isNil(process.env[envString])
  });

  if (unsetEnv.length > 0) {
    throw new Error('Required ENV variables are not set: [' + unsetEnv.join(', ') + ']');
  }
}

module.exports = {
  checkRequiredEnv,
};