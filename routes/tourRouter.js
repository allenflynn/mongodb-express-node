const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.param('id', (req, res, next, id) => {
  console.log(`id: ${id}`);
  next();
});

router
  .route('/:tourName')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;