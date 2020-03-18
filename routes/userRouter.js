const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
// URL Encoding
// router
//   .route('/updateSettingsURL')
//   .post(authController.protect, authController.updateSettingsURL);
router
  .route('/updateSettings')
  .patch(
    authController.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    authController.updateSettings
  );
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
