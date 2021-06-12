const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const staticPath = path.join(__dirname, 'client', 'build');
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '60c38be81666823ee039287c',
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log('server has started');
});
