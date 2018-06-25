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
  const news = News.find({})
  return news
}

module.exports = {
  joiNewsSchema,
  addNews,
  getNews,
}