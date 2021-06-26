const jwt = require('jsonwebtoken');
const { FORBIDDEN } = require('../utils/utils');

module.exports = (req, res, next) => {
  const token = req.headers.cookie.split('token=')[1];

  if (!token) {
    return res
      .status(FORBIDDEN)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (error) {
    return res
      .status(FORBIDDEN)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return res.status(201);
};
