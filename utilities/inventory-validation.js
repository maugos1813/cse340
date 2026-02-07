const utilities = require(".")
const { body, validationResult } = require("express-validator")

/* ******************************
 * Inventory Validation Rules
 * ***************************** */
const inventoryValidationRules = () => {
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

    // body("inv_description")
    //   .trim()
    //   .notEmpty()
    //   .withMessage("Description is required."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number.")
      .toFloat(),

    // body("inv_miles")
    //   .isInt({ min: 0 })
    //   .withMessage("Miles must be a valid number."),

    // body("inv_color")
    //   .trim()
    //   .notEmpty()
    //   .withMessage("Color is required."),

    body("classification_id")
      .isInt()
      .withMessage("Please select a classification."),

    // Make image and thumbnail optional, use default if empty
    body("inv_image")
      .optional({ checkFalsy: true })
      .default("/images/vehicles/no-image.png"),

    body("inv_thumbnail")
      .optional({ checkFalsy: true })
      .default("/images/vehicles/no-image-tn.png")
  ]
}

/* ******************************
 * Check inventory data (Add)
 * ***************************** */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  // Si no se envió imagen o thumbnail, usar valor por defecto
  if (!req.body.inv_image) req.body.inv_image = "/images/vehicles/no-image.png"
  if (!req.body.inv_thumbnail) req.body.inv_thumbnail = "/images/vehicles/no-image-tn.png"

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect =
      await utilities.buildClassificationList(req.body.classification_id)

    req.flash("notice", errors.array()[0].msg)

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      ...req.body
    })
  }
  next()
}

/* ******************************
 * Check inventory data (Update)
 * ***************************** */
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  // Valores por defecto para imágenes en update si vienen vacíos
  if (!req.body.inv_image) req.body.inv_image = "/images/vehicles/no-image.png"
  if (!req.body.inv_thumbnail) req.body.inv_thumbnail = "/images/vehicles/no-image-tn.png"

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)

    return res.status(400).render("inventory/edit-inventory", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      classification_id: req.body.classification_id
    })
  }

  next()
}

// Exportamos todo correctamente
module.exports = {
  inventoryValidationRules,
  checkInventoryData,
  checkUpdateData
}
