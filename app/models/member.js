const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const memberSchemaString = 'Member';
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


MemberSchema.statics = {
  definedPopulate(query) {
    return query
      .populate('user')
      .populate('group');
  },

  getUserInfo: async function({ userName }) {
    const query = this.findOne({
      userName,
    })
    return await this.definedPopulate(query)
  },

  getGroupInfo: async function({ groupName }) {
    const query = this.findOne({
      groupName,
    })
    return await this.definedPopulate(query)
  },

  createLeader: async function({ groupName, userName }) {
    const query = this.create({ groupName, userName, isLeader: true})
    return await this.definedPopulate(query)
  },

  createMember: async function({ groupName, userName }) {
    const query = this.findOneAndUpdate({
      groupName,
      userName,
    }, {
      groupName,
      userName,
    }, {
      new: true,
      upsert: true,
    })
    return await this.definedPopulate(query)
  },
};

mongoose.model(memberSchemaString, MemberSchema);

module.exports = {
  memberSchemaString,
  MemberSchema,
};