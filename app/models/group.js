const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupSchemaString = 'Group';
// const { userSchemaString } = require('./user');

const GroupSchema = new Schema({
  groupName: { type: String, required: true, unique: true },
  groupContact: { type: String, required: true },
  invitationCode: { type: String, required: true },
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

mongoose.model(groupSchemaString, GroupSchema);

module.exports = {
  groupSchemaString,
  GroupSchema,
};