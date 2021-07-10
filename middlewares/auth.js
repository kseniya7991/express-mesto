const { JWT_SECRET, NODE_ENV } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (typeof cookie !== 'string' || cookie === '') {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  /* const token = authorization.split('token=')[1]; */
  const token = cookie.replace('Bearer ', '');

  // Возвращаем ошибку Авторизации при попытке обращения к незащищенному роуту

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return res.status(200);
};
