const router = require('express').Router();
const {
  findCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

// Создание карточки
router.post('/', createCard);

// Поиск всех карточек
router.get('/', findCards);

// Удаление карточки
router.delete('/:cardId', deleteCard);

// Постановка/снятие лайка карточки
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
