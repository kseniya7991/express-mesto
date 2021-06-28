const Card = require('../models/card');

// Импорт ошибок
const BadRequest = require('../errors/bad-req-err');
const NotFound = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-err');
const ForbiddenError = require('../errors/forbidden-err');
const Unauthorized = require('../errors/unauthorized');

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/utils');

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id; // _id станет доступен
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: userId,
  })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Введены некорректные данные карточки');
      }
      throw new InternalServerError('Ошибка сервера');
    })
    .catch(next);
};

module.exports.findCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ cards }))
    .catch(() => {
      throw new InternalServerError('Ошибка сервера');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card && req.user._id === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.send({ dwdawwd }))
          .catch(() => next(new InternalServerError('Ошибка сервера ewew')));
      } else if (!card) {
        return next(new NotFound('Карточка с указанным ID не найдена'));
      } else {
        return next(new ForbiddenError('Нельзя удалить карточку другого пользователя'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Карточка с указанным ID не найдена');
      }
      throw new InternalServerError('Ошибка сервера ewe');
    })
    .catch(next);
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
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным ID не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
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
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным ID не найдена' });
      }
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
