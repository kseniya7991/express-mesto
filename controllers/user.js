const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Импорт ошибок
const BadRequest = require('../errors/bad-req-err');
const NotFound = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-err');
const Unauthorized = require('../errors/unauthorized');

module.exports.findUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      throw new InternalServerError('Ошибка сервера');
    })
    .catch(next);
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      }
      throw new NotFound('Пользователь c таким ID не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFound('Пользователь c таким ID не найден');
      }
      throw new InternalServerError('Ошибка сервера');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
        throw new BadRequest('Введены некорректные данные пользователяa');
      }
      throw new InternalServerError('Ошибка сервера');
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
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
      }
      throw new NotFound('Пользователь c таким ID не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Введены некорректные данные пользователя');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Пользователь c таким ID не найден');
      } else {
        throw new InternalServerError('Ошибка сервера');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
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
      }
      throw new NotFound('Пользователь c таким ID не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Введены некорректные данные аватара пользователя');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Пользователь c таким ID не найден');
      } else {
        throw new InternalServerError('Ошибка сервера');
      }
    })
    .catch(next);
};

module.exports.showCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      throw new NotFound('Пользователь c таким ID не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Пользователь c таким ID не найден');
      } else {
        throw new InternalServerError('Ошибка сервера');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
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
      throw new Unauthorized(err.message);
    })
    .catch(next);
};
