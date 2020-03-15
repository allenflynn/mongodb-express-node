const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const viewRouter = require('./routes/viewRouter');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const appError = require('./utils/appError');

const app = express();

app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development') {
  // app.use(morgan('dev'));
}
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Test middleware
// app.use((req, res, next) => {
//   console.log('cookie:');
//   next();
// });

app.use('/', viewRouter);
app.use('/tour', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res
  //   .status(404)
  //   .json({ message: `Can't find ${req.originalUrl} on this server!` });
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
