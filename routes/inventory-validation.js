const utilities = require(".")
const { body, validationResult } = require("express-validator")

/* ******************************
 *  Inventory Validation Rules
 * ***************************** */
exports.inventoryValidationRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    // body("inv_year")
    //   .isInt({ min: 1900, max: 2099 })
    //   .withMessage("Year must be a valid number."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a number."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),
  ]
}

/* ******************************
 * Check inventory data
 * ***************************** */
exports.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect =
      await utilities.buildClassificationList(req.body.classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors,
      ...req.body, // STICKY DATA
    })
    return
  }
  next()
}

exports.checkUpdateData = async (req, res, next) => {
    console.log("Body received:", req.body)
    const errors = validationResult(req)
    console.log("Validation errors:", errors.array())
    
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)
      req.flash("notice", errors.array()[0].msg)
      return res.status(400).render("inventory/edit-inventory", {
        title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
        nav,
        classificationSelect,
        errors: errors.array(),
        ...req.body
      })
    }
    next()
  }
  