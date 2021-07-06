const express = require('express');
/* const mongoose = require('mongoose'); */
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, isCelebrateError } = require('celebrate');
const validator = require('validator');

const BadRequest = require('./errors/bad-req-err');
const NotFound = require('./errors/not-found-err');

const auth = require('./middlewares/auth');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { createUser, login } = require('./controllers/user');

/* const { INTERNAL_SERVER_ERROR } = require('./utils/utils'); */

/* const { PORT = 3000 } = process.env; */

const app = express();

const method = (value) => {
  const correctLink = validator.isURL(value, { require_protocol: true });
  if (!correctLink) {
    return new BadRequest('Введены некорректные аватара пользователя');
  }
  return value;
};

// Подключаемся к серверу mongo
/* async function start() {
  try {
    app.listen(PORT, () => `Server is running on port ${PORT} `);
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  } catch (error) {
    return `Init application error: status ${INTERNAL_SERVER_ERROR} ${error}`;
  }
  return null;
} */

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser('secret'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(method, 'Validation Link'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// авторизация
app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('/*', (req, res, next) => next(new NotFound('Запрашиваемый ресурс не найден')));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (isCelebrateError(err)) {
    res.status(400).send({ message: 'Введены некорректные данные' });
  }

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

/* start(); */

module.exports = app;
