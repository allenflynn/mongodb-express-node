require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const tours = JSON.parse(fs.readFileSync('tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('reviews.json', 'utf-8'));

const importData = async () => {
  try {
    // await Tour.create(tours);
    // await User.create(users);
    await Review.create(reviews);
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === 'import') {
  importData();
} else if (process.argv[2] === 'delete') {
  deleteData();
}
