const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const progressSchemaString = 'Progress';
const { groupSchemaString } = require('./group');
const { questionSchemaString } = require('./question');

const ProgressSchema = new Schema({
  groupName: { type: String, required: true },
  questionNumber: {type: String, required: true},
  answerHistory: [{ type: String, required: false }],
  completeTime: { type: Date, required: false },
  score: { type: Number, required: false},
}, {
  timestamps: true,
});

ProgressSchema.virtual('group', {
  ref: groupSchemaString,
  localField: 'groupName',
  foreignField: 'groupName',
  justOne: true,
});

ProgressSchema.virtual('question', {
  ref: questionSchemaString,
  localField: 'questionNumber',
  foreignField: 'questionNumber',
  justOne: true,
});

ProgressSchema.statics = {
  definedPopulate(query) {
    return query
          .populate('group')
          .populate('question')
  },
  populateGroup(query) {
    return query.populate('group');
  },

  populateQuestion(query) {
    return query.populate('question')
  },
};

mongoose.model(progressSchemaString, ProgressSchema);

module.exports = {
  progressSchemaString,
  ProgressSchema,
};