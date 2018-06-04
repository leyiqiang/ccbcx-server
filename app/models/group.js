const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupSchemaString = 'Group';

const GroupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  groupQQ: { type: Number, required: true },
  leaderId: { type:String, required: true },
});

mongoose.model(groupSchemaString, GroupSchema);

module.exports = {
  groupSchemaString,
  GroupSchema,
};