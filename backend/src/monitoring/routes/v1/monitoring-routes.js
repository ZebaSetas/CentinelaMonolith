const express = require('express');
const MonitoringController = require('../../controllers/monitoring-controller');
const monitoringController = new MonitoringController()
const router = express.Router();
router.get('/ping', monitoringController.ping);

module.exports = router;
