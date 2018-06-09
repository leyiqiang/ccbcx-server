const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionGroupSchemaString = 'QuestionGroup';

const GROUP_ONE = 1
const GROUP_TWO = 2
const GROUP_THREE = 3
const GROUP_META = 4

const QuestionGroup = new Schema({
  groupType: {
    type: Number,
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
  GROUP_ONE,
  GROUP_TWO,
  GROUP_THREE,
  GROUP_META,
  questionGroupSchemaString,
  QuestionGroup,
};