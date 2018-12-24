'use strict';
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
  name: { type: String, required: true, max: 100 }
});

GenreSchema.virtual('url').get(() => {
  return '/catalog/genre';
});

module.exports = mongoose.model('Genre', GenreSchema);
