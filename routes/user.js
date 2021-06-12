const router = require('express').Router();
const {
  findUsers, findUser, createUser, updateUser, updateAvatar,
} = require('../controllers/user');

router.post('/', createUser);

router.get('/', findUsers);

router.get('/:userId', findUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
