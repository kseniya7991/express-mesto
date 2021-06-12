const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const userId = req.user._id; // _id станет доступен
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: userId,
  })
    .then((card) => res.send({ card }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ err }));
};

module.exports.findCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ cards }))
    .catch((error) => res.send({ error }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ card }))
    .catch((error) => res.send({ error }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((error) => res.send({ error }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((error) => res.send({ error }));
};
