const express = require('express');
const morgan = require('morgan');
const viewRouter = require('./routes/viewRouter');
const tourRouter = require('./routes/tourRouter');

const app = express();

app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static('public'));

app.use('/', viewRouter);
app.use('/tour', tourRouter);

module.exports = app;
