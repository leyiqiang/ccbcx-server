const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blackListSchemaString = 'BlackList';
// const { userSchemaString } = require('./user');

const BlackListSchema = new Schema({
  groupName: { type: String, required: true, unique: true },
  blockedUntil: { type: Date, required: true },
});

mongoose.model(blackListSchemaString, BlackListSchema);

module.exports = {
  blackListSchemaString,
  BlackListSchema,
};