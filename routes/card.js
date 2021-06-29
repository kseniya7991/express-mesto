const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  findCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

// Создание карточки
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2),
  }),
}), createCard);

// Поиск всех карточек
router.get('/', findCards);

// Удаление карточки
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

// Постановка/снятие лайка карточки
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
