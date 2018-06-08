const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchemaString = 'Question';
// const { userSchemaString } = require('./user');

const GROUP_ONE = 'GROUP_ONE'
const GROUP_TWO = 'GROUP_TWO'
const GROUP_THREE = 'GROUP_THREE'
const GROUP_META = 'GROUP_META'

const QuestionSchema = new Schema({
  // questionNumber should be in x-y, or M-z format
  // x = 1~3, y = 1~10, z = 1~10
  questionNumber: { type: String, required: true, unique: true },
  groupType: { type: String, enum:[GROUP_ONE, GROUP_TWO, GROUP_THREE, GROUP_META] },
  questionContent: { type: String, required: true }, // TODO Rich text with support of pictures
  answer: { type: String, required: true },
});

// GroupSchema.virtual('user', {
//   ref: userSchemaString,
//   localField: 'groupName',
//   foreignField: 'groupName',
//   justOne: true,
// });
//
// GroupSchema.statics = {
//   definedPopulate(query) {
//     return query.populate('user');
//   },
// };

mongoose.model(questionSchemaString, QuestionSchema);

module.exports = {
  questionSchemaString,
  QuestionSchema,
};