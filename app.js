require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, isCelebrateError } = require('celebrate');
const validator = require('validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const BadRequest = require('./errors/bad-req-err');
const NotFoundError = require('./errors/not-found-err');

const auth = require('./middlewares/auth');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { createUser, login } = require('./controllers/user');

const app = express();

const methodValidation = (value) => {
  const correctLink = validator.isURL(value, { require_protocol: true });
  if (!correctLink) {
    return new BadRequest('Введены некорректные аватара пользователя');
  }
  return value;
};

const allowedCors = [
  'https://kst.mesto.nomoredomains.club',
  'http://kst.mesto.nomoredomains.club',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.status(200).send();
  }

  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser('secret'));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(methodValidation, 'Validation Link'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// авторизация
app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

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

module.exports = app;
