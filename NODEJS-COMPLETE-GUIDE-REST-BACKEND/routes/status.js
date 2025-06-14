const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/status', isAuth, feedController.getStatus);

router.put('/status', isAuth, [
    body('status').trim().not().isEmpty()
], feedController.updateStatus);

module.exports = router;