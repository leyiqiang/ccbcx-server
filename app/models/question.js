const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchemaString = 'Question';
const { questionGroupSchemaString } = require('./questionGroup');
const { GROUP_ONE, GROUP_TWO, GROUP_THREE, GROUP_META } = require('../models/questionGroup')

const QuestionSchema = new Schema({
  // questionNumber should be in x-y format
  // x = 1~10, y = 1~10/m
  questionNumber: { type: String, required: true, unique: true },
  groupType: { type: Number, enum:[GROUP_ONE, GROUP_TWO, GROUP_THREE, GROUP_META] },
  answer: { type: String, required: true },
  hint1: { type: String, required: false },
  hint2: { type: String, required: false },
  hint3: { type: String, required: false },
  isMeta: { type: Boolean, required: true },
});

QuestionSchema.virtual('questionGroup', {
  ref: questionGroupSchemaString,
  localField: 'groupType',
  foreignField: 'groupType',
  justOne: true,
});

QuestionSchema.statics = {
  definedPopulate(query) {
    return query.populate('questionGroup');
  },
};

mongoose.model(questionSchemaString, QuestionSchema);

module.exports = {
  questionSchemaString,
  QuestionSchema,
};