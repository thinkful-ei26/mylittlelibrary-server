'use strict';
var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: Date,
  date_of_death: Date
});

// Virtuals for authors full name, lifespan, and url
AuthorSchema.virtual('name').get(function() {
  return this.family_name + ', ' + this.first_name;
});

AuthorSchema.virtual('lifespan').get(function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = moment(this.date_of_birth).format('MMMM Do, YYYY');
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string += moment(this.date_of_death).format('MMMM Do, YYYY');
  }
  return lifetime_string;
});
AuthorSchema.virtual('url').get(function() {
  return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
