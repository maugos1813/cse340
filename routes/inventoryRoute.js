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
  checkUpdateData,
} = require("../utilities/inventory-validation")

// 🔹 Only protected routes use this middleware
const { checkLogin } = require("../utilities")

/* ******************************
 * Public Routes (no login required)
 * ***************************** */

// Inventory by classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Inventory detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildInventoryDetail)
)

// Inventory list / management (public view, change if you want protected)
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Get inventory JSON by classification
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ******************************
 * Protected Routes (require login)
 * ***************************** */

// Add classification view
router.get(
  "/add-classification",
  checkLogin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification
router.post(
  "/add-classification",
  checkLogin,
  classificationValidationRules(),
  checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
  "/add-inventory",
  checkLogin,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  checkLogin,
  inventoryValidationRules(),
  checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Build edit inventory view
router.get(
  "/edit/:inv_id",
  checkLogin,
  utilities.handleErrors(invController.editInventoryView)
)

// Route to process inventory update
router.post(
  "/update",
  checkLogin,
  inventoryValidationRules(),
  checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to trigger intentional error (Task 3)
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteConfirmation)
)

router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router
