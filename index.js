'use strict';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const morgan = require('morgan');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { Book } = require('./models/test_model');
const { dbConnect } = require('./db-mongoose');
const app = express();
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// const testOutput = {
//   title: 'test title',
//   author: 'test author'
// };
// app.get('/books/testOutput', (req, res) => {
//   res.json(testOutput);
// });

app.get('/books', (req, res) => {
  Book.find()
    .then(books => res.json(books.map(book => book.serialize())))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'something went wrong' });
    });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
