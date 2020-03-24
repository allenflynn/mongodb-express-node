const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const User = require('../models/userModel');

const createSendToken = (user, statusCode, res) => {
  const privateKey = process.env.PRIVATEKEY;
  const token = jwt.sign({ id: user._id }, privateKey, { expiresIn: '1h' });
  cookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
  };
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: { user },
    token
  });
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.confirm
  });
  createSendToken(newUser, 201, res);
};

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
  if (!user || !(await user.compare(password, user.password))) {
    const err = new Error('Incorrect email or password');
    err.statusCode = 401;
    return next(err);
  }

  // 3. Send token to client
  createSendToken(user, 200, res);
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
  let token;

  // 1. Get token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    const err = new Error(
      'You are not logged in! Please log in to get access.'
    );
    err.statusCode = 401;
    return next(err);
  }

  // 2. Verify token
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.PRIVATEKEY);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      const err = new Error(
        'The user belonging to this token does no longer exist.'
      );
      err.statusCode = 401;
      return next(err);
    }

    // Passing user to next
    req.user = currentUser;

    res.locals.user = currentUser;
    next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      res.status(401).render('error', {
        title: 'Error',
        message: 'Your token has expired! Please log in again.'
      });
    }
  }
};

// URL Encoding
// exports.updateSettingsURL = async (req, res, next) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       {
//         name: req.body.name,
//         email: req.body.email
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).render('account', {
//       title: 'Your account',
//       user: updatedUser
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// API
exports.updateSettings = async (req, res, next) => {
  if (req.file) {
    console.log(req.file);
    req.body.photo = req.file.filename;
  }

  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    if (error.name == 'ValidationError') {
      return res
        .status(400)
        .json({ status: error._message, message: error.errors.email.message });
    }
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // 1. Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2. Check if current password is correct
    const match = await user.compare(req.body.current, user.password);
    if (!match) {
      const err = new Error('Your current pasword is wrong.');
      err.statusCode = 401;
      return next(err);
    }

    // update
    user.password = req.body.password;
    user.passwordConfirm = req.body.confirm;
    await user.save();
    createSendToken(user, 200, res);
  } catch (error) {
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        status: error._message,
        message: error.errors['passwordConfirm'].message
      });
    }
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1. Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const err = new Error('There is no user with the email address.');
      err.statusCode = 404;
      return next(err);
    }

    // 2. Generate the random reset token
    const token = user.resetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // 3. Email reset link to user
    await sendEmail(req, token);
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1. Get user based on the token
    const token = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2. If token has not expired, and there is user, set the new password
    if (!user) {
      const err = new Error('Token is invalid or has expired.');
      err.statusCode = 400;
      return next(err);
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    await user.save();

    // 3. Update changePasswordAt property for the user

    // 4. Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
