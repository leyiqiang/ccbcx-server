const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const progressSchemaString = 'Progress';
// const { userSchemaString } = require('./user');

const ProgressSchema = new Schema({
  groupName: { type: String, required: true },
  questionNumber: {type: String, required: true},
  answerHistory: { type: Array, required: false },
  completeTime: { type: Date, required: false },
  score: { type: Number, required: false},
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

mongoose.model(progressSchemaString, ProgressSchema);

module.exports = {
  progressSchemaString,
  ProgressSchema,
};