const express = require('express')
const IsAliveController = require('../../controllers/is-alive-controller');
const isAliveController = new IsAliveController()
const router = express.Router();
router.get('/ping', isAliveController.ping);
module.exports = router;
