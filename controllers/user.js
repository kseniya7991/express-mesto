const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/utils');

module.exports.findUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NOT_FOUND).send({ message: ' файнд Пользователь c таким ID не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: ' файнд ыПользователь c таким ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      user: {
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'создание Введены некорректные данные пользователя' });
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
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NOT_FOUND).send({ message: 'апдейт Пользователь c таким ID не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные пользователя' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'апдейт Пользователь c таким ID не найден' });
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
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NOT_FOUND).send({ message: 'апдейт Пользователь c таким ID не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные аватара' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'апдейт Пользователь c таким ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.showCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь c таким ID не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Пользователь c таким ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });

      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
