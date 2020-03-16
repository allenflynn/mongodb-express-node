const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    const err = new Error('Please provide email and password');
    err.statusCode = 400;
    return next(err);
  }

  // 2. Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.passwordCheck(password, user.password))) {
    const err = new Error('Incorrect email or password');
    err.statusCode = 401;
    return next(err);
  }

  // 3. Send token to client
  const privateKey = process.env.PRIVATEKEY;
  const token = jwt.sign({ id: user._id }, privateKey, { expiresIn: '1h' });
  cookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
  };
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    data: { user },
    token
  });
};

exports.isLoggedIn = async (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (cookie) {
    try {
      const decoded = jwt.verify(cookie, process.env.PRIVATEKEY);
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      res.locals.user = currentUser;
      return next();
    } catch (error) {
      console.log(error);
    }
  }
  next();
};

exports.logout = async (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {
    const err = new Error(
      'You are not logged in! Please log in to get access.'
    );
    err.statusCode = 401;
    return next(err);
  }
  if (cookie) {
    try {
      const decoded = jwt.verify(cookie, process.env.PRIVATEKEY);
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        const err = new Error(
          'The user belonging to this token does no longer exist.'
        );
        err.statusCode = 401;
        return next(err);
      }
      res.locals.user = currentUser;
      next();
    } catch (error) {
      console.log(error);
    }
  }
};
