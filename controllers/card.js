const Card = require('../models/card');
const { ERROR_INCORRECT, ERROR_UNDEFINED, ERROR_SERVER } = require('../utils/utils');

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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT).send({ message: 'Введены некорректные данные карточки' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.findCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ cards }))
    // данные не записались, вернём ошибку
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(ERROR_UNDEFINED).send({ message: 'Карточка с указанным ID не найдена' });
      }
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.CastError === undefined) {
        res.status(ERROR_INCORRECT).send({ message: 'Карточка с указанным ID не найдена' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(ERROR_UNDEFINED).send({ message: 'Карточка с указанным ID не найдена' });
      }
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.CastError === undefined) {
        res.status(ERROR_INCORRECT).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(ERROR_UNDEFINED).send({ message: 'Карточка с указанным ID не найдена' });
      }
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.CastError === undefined) {
        res.status(ERROR_INCORRECT).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
      }
    });
};
