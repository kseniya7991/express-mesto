const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/utils');

module.exports.findUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err) {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь c таким ID не найден' });
      }
    })
    // данные не записались, определим и вернем ошибку
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Пользователь c таким ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
  // данные не записались, определим и вернем ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь c таким ID не найден' });
      }
    })
    // данные не записались, определим и вернем ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные пользователя' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Пользователь c таким ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь c таким ID не найден' });
      }
    })
    // данные не записались, определим и вернем ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные аватара' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Пользователь c таким ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
