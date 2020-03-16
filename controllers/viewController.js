const Tour = require('../models/tourModel');

exports.getViews = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).render('index', {
      title: 'All Tours',
      tours
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSignupForm = async (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up'
  });
};

exports.getLoginForm = async (req, res) => {
  res.status(200).render('login', {
    title: 'Login'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};
