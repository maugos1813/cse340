// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

const utilities = require("../utilities");

// Route to build inventory detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildInventoryDetail)
);

// Route to trigger intentional error (Task 3)
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);

module.exports = router;