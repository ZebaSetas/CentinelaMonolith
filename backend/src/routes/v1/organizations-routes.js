const express = require('express')
const OrganizationController = require(
  '../../controllers/organization-controller')
const organizationController = new OrganizationController()
const router = express.Router()

router.get('/:id', organizationController.getOrganization)

module.exports = router
