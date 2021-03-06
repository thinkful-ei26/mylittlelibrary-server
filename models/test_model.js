'use strict';
var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  summary: String,
  status: {
    type: String,
    required:false,
    enum: ['Available', 'Maintenance', 'On-loan', 'Reserved', 'Missing']
  },
  isbn: { type: String }
});

bookSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    author: this.author,
    genre: this.genre,
    status: this.status,
    summary: this.summary
  };
};

// schema.index({name: 'text', 'profile.something': 'text'});
bookSchema.index({ title: 'text' });
// Export model.
const Book = mongoose.model('Book', bookSchema);

module.exports = { Book };
