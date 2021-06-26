const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const loginRoutes = require('./routes/login');

const { NOT_FOUND } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();

// Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '60c38be81666823ee039287c',
  };
  next();
});

app.use('/signin', loginRoutes);
app.post('/signup', userRoutes);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('/*', (req, res) => { res.status(NOT_FOUND).send({ message: 'Запрашиваемывй ресурс не найден' }); });

app.listen(PORT);
