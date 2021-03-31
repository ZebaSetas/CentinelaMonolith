const express = require('express');
const SenderController = require('../../controllers/sender-controller');
const senderController = new SenderController()
const router = express.Router();
router.get('/ping', senderController.ping);

module.exports = router;
