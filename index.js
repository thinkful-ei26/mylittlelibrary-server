'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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
app.use(bodyParser.json());

// app.get('/books', (req, res, next) => {
//   Book.find()
//     // .limit(3)
//     .then(books => res.json(books.map(book => book.serialize())))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: 'something went wrong' });
//     });
// });

//********************************************* */
// create a new object, if title
app.get('/books/', (req, res, next) => {
  //   if(title in req.params){
  // Book.find({title:title})
  //   }
  let query = {};
  const { title, author, genre, status } = req.query;
  if (title) {
    // query = { title: title };
    query.title=title;
  }
  console.log(title);
  Book.find(
    query
    // $or: [
    //   { title: title },
    //   { status: status },
    //   { genre: genre },
    //   { author: author}
    // ]
  )
    .then(books => res.json(books.map(book => book.serialize())))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'something went wrong' });
    });
});
// **********************************************/

//********************************************* */
// app.get('/books/student/:s', (req, res, next) => {
//   // const title = req.params.title;
//   Book.find({ $or: [{'title':/[a-z]/ig},{'status': /[a-z]/ig},{'genre':/[a-z]/ig},{'author':/[a-z]/ig}]})
//     .then(books => res.json(books.map(book => book.serialize())))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: 'something went wrong' });
//     });
// });
// **********************************************/

app.get('/books/:id', (req, res, next) => {
  const id = req.params.id;
  Book.findById(id)
    .then(item => {
      if (item) {
        res.json(item.serialize());
      } else {
        next;
      }
    })
    .catch(next);
});

app.post('/books/', (req, res, next) => {
  console.log(req.body);
  const { title, author, genre, status } = req.body;
  if (!title) {
    const err = new Error('Missing required fields');
    err.status = 400;
    return next(err);
  }
  Book.create({ title, author, genre, status })
    .then(item => {
      return res
        .status(201)
        .location(`/books/${item.id}`)
        .json(item.serialize());
    })
    .catch(next);
});

app.put('/books/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, author, genre, status } = req.body;
  const updateItem = {};
  const updateableFields = ['title', 'author', 'genre', 'status'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateItem[field] = req.body[field];
    }
  });
  if (!title) {
    const err = new Error('Missing required fields');
    err.status = 400;
    return next(err);
  }
  Book.findByIdAndUpdate(id, updateItem, { new: true })
    .then(item => {
      if (item) {
        res.json(item.serialize());
      }
    })
    .catch(next);
});

app.delete('/books/:id', (req, res, next) => {
  const { id } = req.params;
  Book.findByIdAndRemove(id)
    .then(item => {
      if (item) {
        res.status(204).end();
      }
    })
    .catch(next);
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
