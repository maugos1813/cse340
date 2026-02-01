const utilities = require(".")
const { body, validationResult } = require("express-validator")

/* ******************************
 *  Classification Validation Rules
 * ***************************** */
exports.classificationValidationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage(
        "Classification name must contain only letters and numbers."
      ),
  ]
}

/* ******************************
 * Check classification data
 * ***************************** */
exports.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
    })
    return
  }
  next()
}
