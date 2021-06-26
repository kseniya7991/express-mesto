const router = require('express').Router();
const {
  findUsers, findUser, updateUser, updateAvatar, showCurrentUser,
} = require('../controllers/user');

// Поиск всех пользователей
router.get('/', findUsers);

// Возвращаем текущего пользователя
router.get('/me', showCurrentUser);

// Поиск конкретного пользователя по ID
router.get('/:userId', findUser);

// Обновление данных пользователя
router.patch('/me', updateUser);

// Обновление аватара пользователя
router.patch('/me/avatar', updateAvatar);

module.exports = router;
