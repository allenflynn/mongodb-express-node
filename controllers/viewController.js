const Tour = require('../models/tourModel');

exports.getViews = async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('index', {
    title: 'All Tours',
    tours
  });
};

exports.getLoginForm = async (req, res) => {
  res.status(200).render('login', {
    title: 'Login'
  });
};
