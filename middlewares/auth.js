const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const token = req.headers.cookie.split('token=')[1];

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (erу) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return res.status(200);
};
