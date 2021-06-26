const router = require('express').Router();
const {
  findUsers, findUser, updateUser, updateAvatar,
} = require('../controllers/user');

// Поиск всех пользователей
router.get('/', findUsers);

// Поиск конкретного пользователя по ID
router.get('/:userId', findUser);

// Обновление данных пользователя
router.patch('/me', updateUser);

// Обновление аватара пользователя
router.patch('/me/avatar', updateAvatar);

module.exports = router;
