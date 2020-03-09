const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.route('/').get(viewController.getViews);
router.route('/login').get(viewController.getLoginForm);

module.exports = router;
