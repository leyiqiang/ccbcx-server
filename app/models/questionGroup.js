const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionGroupSchemaString = 'QuestionGroup';

const GROUP_ONE = 'GROUP_ONE'
const GROUP_TWO = 'GROUP_TWO'
const GROUP_THREE = 'GROUP_THREE'
const GROUP_META = 'GROUP_META'

const QuestionGroup = new Schema({
  groupType: {
    type: String,
    enum:[GROUP_ONE, GROUP_TWO, GROUP_THREE, GROUP_META],
    unique: true,
  },
  groupName: { type: String, required: true },
  releaseTime: {type: Date, required: false }, // no need when it's meta
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

mongoose.model(questionGroupSchemaString, QuestionGroup);

module.exports = {
  questionGroupSchemaString,
  QuestionGroup,
};