const router = require('express').Router();
const { login } = require('../controllers/login');

// Авторизация пользователя
router.post('/', login);

module.exports = router;
