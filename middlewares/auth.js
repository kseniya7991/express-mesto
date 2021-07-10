const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (typeof cookie !== 'string' || cookie === '') {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = cookie.split('token=')[1];

  // Возвращаем ошибку Авторизации при попытке обращения к незащищенному роуту

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return res.status(200);
};
