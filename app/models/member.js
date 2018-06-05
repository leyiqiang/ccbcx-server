const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const memberSchemaString = 'Member';
// const _ = require('lodash')
const { userSchemaString } = require('./user');
const { groupSchemaString } = require('./group');

const MemberSchema = new Schema({
  groupName: { type: String, required: true },
  userName: { type: String, required: true },
  isLeader: { type: Boolean, required: true, default: false },
});

MemberSchema.virtual('group', {
  ref: groupSchemaString,
  localField: 'groupName',
  foreignField: 'groupName',
  justOne: true,
});

MemberSchema.virtual('user', {
  ref: userSchemaString,
  localField: 'userName',
  foreignField: 'userName',
  justOne: true,
});

MemberSchema.set('toObject', { virtuals: true });
MemberSchema.set('toJson', { virtuals: true });

MemberSchema.statics = {
  definedPopulate(query) {
    return query
      .populate('user')
      .populate('group');
  },

  populateUser(query) {
    return query
    .populate('user')
  },

  populateGroup(query) {
    return query
    .populate('group')
  },

  // getUserInfo: async function({ userName }) {
  //   const query = await this.findOne({
  //     userName,
  //   })
  //   return await this.populateUser(query)
  // },
  //
  // createMember: async function({ groupName, userName }) {
  //   const query = this.findOneAndUpdate({
  //     groupName,
  //     userName,
  //   }, {
  //     groupName,
  //     userName,
  //   }, {
  //     new: true,
  //     upsert: true,
  //   })
  //   return await this.definedPopulate(query)
  // },
};

mongoose.model(memberSchemaString, MemberSchema);

module.exports = {
  memberSchemaString,
  MemberSchema,
};