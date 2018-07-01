const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const newsSchemaString = 'News';
// const { userSchemaString } = require('./user');

const NewsSchema = new Schema({
  message: { type: String, required: true },
}, {
  timestamps: true,
});

mongoose.model(newsSchemaString, NewsSchema);

module.exports = {
  newsSchemaString,
  NewsSchema,
};