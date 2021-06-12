const User = require('../models/user');

module.exports.findUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.send({ err }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ user }))
    .catch((err) => res.send({ err }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
  // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ err }));
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    })
    .then((user) => res.send({ user }))
    .catch((err) => res.status(500).send({ err }));
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    })
    .then((user) => res.send({ user }))
    .catch((err) => res.status(500).send({ err }));
};
