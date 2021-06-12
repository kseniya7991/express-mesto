const router = require('express').Router();
const {
  findCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

router.post('/', createCard);

router.get('/', findCards);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
