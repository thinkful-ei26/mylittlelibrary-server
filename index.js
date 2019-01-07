'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, CLIENT_ORIGIN } = require('./config');
const { Book } = require('./models/test_model');
const { dbConnect } = require('./db-mongoose');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(bodyParser.json());
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });
/****************AUTHENTICATION ROUTES***************** */
// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});











/***************AUTHENTICATION ROUTES END**************** */
app.get('/books/', (req, res) => {
  let query = {};
  // const {genericQuery} =req.query;
  const { title, author, genre, status } = req.query;
  if (title) {
    query.title = title;
  } else if(author){
    query.author = author;
  }else if(genre){
    query.genre= genre;
  }else if(status){
    query.status=status;
  }
  Book.find(query)
    .then(books => res.json(books.map(book => book.serialize())))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'something went wrong' });
    });
});

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
  // console.log(req.body);
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
