const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string' || authorization === '') {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  /* const token = authorization.split('token=')[1]; */
  const token = authorization.replace('Bearer ', '');

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
