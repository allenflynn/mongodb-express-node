const express = require('express');
const authController = require('../controllers/authController');

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
  .patch(authController.protect, authController.updateSettings);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

// router
//   .route('/updateSettings')
//   .patch(
//     userController.uploadUserPhoto,
//     userController.resizeUserPhoto,
//     userController.updateSettings
//   );
// router.route('/updatePassword').patch(authController.updatePassword);

module.exports = router;
