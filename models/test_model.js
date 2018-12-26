'use strict';
var mongoose = require('mongoose');
// 
var Schema = mongoose.Schema;

var testbookSchema = mongoose.Schema({
  title:{type: String},
  author: {type: String},
  genre: {type:String}
});

testbookSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    author: this.author,
    genre: this.genre
  };
};
// Export model.

module.exports = mongoose.model('Books', testbookSchema);
