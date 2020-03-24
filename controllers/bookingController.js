const Tour = require('../models/tourModel');

exports.checkoutSession = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);
};
