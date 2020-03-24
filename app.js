const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const viewRouter = require('./routes/viewRouter');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const bookingRouter = require('./routes/bookingRouter');
const errorController = require('./controllers/errorController');
// const appError = require('./utils/appError');

// Start express app
const app = express();
app.set('view engine', 'pug');

// Middlewares
if (process.env.NODE_ENV === 'development') {
  // app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Test middleware
// app.use((req, res, next) => {
//   console.log('cookie:');
//   next();
// });

// Routes
app.use('/', viewRouter);
app.use('/tour', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);

// Error handling
app.all('*', (req, res, next) => {
  // res
  //   .status(404)
  //   .json({ message: `Can't find ${req.originalUrl} on this server!` });
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});
app.use(errorController);

module.exports = app;
