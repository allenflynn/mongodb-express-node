const fs = require('fs');
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(201).json({
      tours
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findOne({
      name: req.params.tourName.replace(/-/g, ' ')
    }).populate('reviews', 'review rating user');
    if (!tour) {
      const err = new Error('There is no tour with that name.');
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).render('tour', { title: tour.name, tour });
  } catch (error) {
    console.log(error);
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      newTour
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ tour });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(404).end();
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
