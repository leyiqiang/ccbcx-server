'use strict';
// const config = require('../../config');
const mongoose = require('mongoose');
const { newsSchemaString } = require('../models/news');
const Joi = require('joi');

const News = mongoose.model(newsSchemaString);

const joiNewsSchema = Joi.object().keys({
  message: Joi.string().required(),
});


async function addNews({ message }) {
  const news = new News({message})
  return news.save()
}

async function getNews() {
  const news = News.find({}).sort({createdAt: -1})
  return news
}

async function getLatestNews() {
  const news = News.findOne({}).sort({createdAt: -1})
  return news
}

async function deleteNews({_id}) {
  return News.findOneAndDelete({_id})
}

module.exports = {
  joiNewsSchema,
  addNews,
  getNews,
  deleteNews,
  getLatestNews,
}