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

// Inventory list / management (public view)
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
 * Protected Routes (Employee/Admin only)
 * ***************************** */

// Add classification view
router.get(
  "/add-classification",
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification
router.post(
  "/add-classification",
  utilities.checkAdminOrEmployee,
  classificationValidationRules(),
  checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
  "/add-inventory",
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process add inventory
router.post(
  "/add-inventory",
  utilities.checkAdminOrEmployee,
  inventoryValidationRules(),
  checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.editInventoryView)
)

// Process inventory update
router.post(
  "/update",
  utilities.checkAdminOrEmployee,
  inventoryValidationRules(),
  checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.buildDeleteConfirmation)
)

// Process inventory deletion
router.post(
  "/delete",
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.deleteInventoryItem)
)

// Route to trigger intentional error (for testing)
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router
