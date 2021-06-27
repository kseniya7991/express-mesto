const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { createUser, login } = require('./controllers/user');

const { NOT_FOUND } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();

// Подключаемся к серверу mongo
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
    });
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(`Init application error: ${error}`);
  }
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser('secret'));

app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('/*', (req, res) => { res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' }); });

start();
