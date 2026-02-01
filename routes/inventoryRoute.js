// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const {
  classificationValidationRules,
  checkClassificationData,
} = require("../utilities/classification-validation")
const {
  inventoryValidationRules,
  checkInventoryData,
} = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route to build inventory detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildInventoryDetail)
)

// Inventory management view
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification
router.post(
  "/add-classification",
  classificationValidationRules(),
  checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to trigger intentional error (Task 3)
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  inventoryValidationRules(),
  checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
