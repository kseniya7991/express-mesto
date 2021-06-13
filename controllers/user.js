const User = require('../models/user');
const { ERROR_INCORRECT, ERROR_UNDEFINED, ERROR_SERVER } = require('../utils/utils');

module.exports.findUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err) {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ user }))
    // данные не записались, определим и вернем ошибку
    .catch((err) => {
      if (err.messageFormat === undefined) {
        res.status(ERROR_UNDEFINED).send({ message: 'Пользователь c таким ID не найден' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
  // данные не записались, определим и вернем ошибку
    .catch((err) => {
      if (err._message === 'user validation failed') {
        res.status(ERROR_INCORRECT).send({ message: 'Введены некорректные данные пользователя' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
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
    .then((user) => res.send({ user }))
    // данные не записались, определим и вернем ошибку
    .catch((err) => {
      if (err._message === 'Validation failed') {
        res.status(ERROR_INCORRECT).send({ message: 'Введены некорректные данные аватара' });
      } else if (err.messageFormat === undefined) {
        res.status(ERROR_UNDEFINED).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
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
    .then((user) => res.send({ user }))
    // данные не записались, определим и вернем ошибку
    .catch((err) => {
      if (err._message === 'Validation failed') {
        res.status(ERROR_INCORRECT).send({ message: 'Введены некорректные данные аватара' });
      } else if (err.messageFormat === undefined) {
        res.status(ERROR_UNDEFINED).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
      }
    });
};
