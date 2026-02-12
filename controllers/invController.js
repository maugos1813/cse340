const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const favoriteModel = require("../models/favorite-model") // <-- agregado
const reviewModel = require("../models/review-model")


const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ***************************/
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId)
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      return next(new Error("No vehicles found for this classification."))
    }

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build inventory detail view (updated for favorites)
 * ***************************/
invCont.buildInventoryDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getInventoryById(inv_id)
    const vehicle = data[0]

    if (!vehicle) {
      return next(new Error("Vehicle not found"))
    }

    const vehicleHTML = await utilities.buildVehicleDetail(vehicle)
    const nav = await utilities.getNav()

    // -------------------------------
    // FAVORITES LOGIC
    // -------------------------------
    let isFavorite = false
    const loggedin = res.locals.loggedin

    if (loggedin) {
      const account_id = res.locals.accountData.account_id
      const check = await favoriteModel.checkFavorite(account_id, inv_id)
      isFavorite = check.rowCount > 0
    }

    // -------------------------------
    // REVIEWS LOGIC (NEW)
    // -------------------------------
    const reviews = await reviewModel.getReviewsByVehicle(inv_id)

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
      inv_id,
      loggedin,
      isFavorite,
      reviews // ← MUY IMPORTANTE
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 * Intentional error trigger
 * ***************************/
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional server error for testing")
}

/* ***************************
 * Inventory Management view
 * ***************************/
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Add Classification views
 * ***************************/
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    const nav = await utilities.getNav()
    if (result) {
      req.flash("notice", "Classification added successfully.")
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect: await utilities.buildClassificationList(),
        errors: null,
      })
    } else {
      req.flash("notice", "Failed to add classification.")
      res.redirect("/inv/add-classification")
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Add Inventory views
 * ***************************/
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Process Add Inventory POST
 * ***************************/
invCont.addInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const inventoryData = {
      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_year: req.body.inv_year || null,
      inv_description: req.body.inv_description || "",
      inv_price: req.body.inv_price || 0,
      inv_miles: req.body.inv_miles || 0,
      inv_color: req.body.inv_color || "",
      classification_id: req.body.classification_id || null,
      inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.png",
    }

    const result = await invModel.addInventory(inventoryData)

    if (result) {
      req.flash("notice", "Vehicle added successfully.")
      res.redirect("/inv")
    } else {
      const classificationSelect =
        await utilities.buildClassificationList(inventoryData.classification_id)

      res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationSelect,
        ...inventoryData,
        errors: [{ msg: "Failed to add vehicle." }],
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Return Inventory by Classification As JSON
 * ***************************/
invCont.getInventoryJSON = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (invData && invData.length > 0) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build edit inventory view
 * ***************************/
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()

    const itemData = await invModel.getInventoryById(inv_id)
    if (!itemData || itemData.length === 0) {
      return next(new Error("Inventory item not found"))
    }

    const vehicle = itemData[0]
    const classificationSelect = await utilities.buildClassificationList(vehicle.classification_id)
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_description: vehicle.inv_description,
      inv_image: vehicle.inv_image,
      inv_thumbnail: vehicle.inv_thumbnail,
      inv_price: vehicle.inv_price,
      inv_miles: vehicle.inv_miles,
      inv_color: vehicle.inv_color,
      classification_id: vehicle.classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ***************************/
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ***************************/
invCont.buildDeleteConfirmation = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()

    const itemData = await invModel.getInventoryById(inv_id)
    if (!itemData || itemData.length === 0) {
      return next(new Error("Inventory item not found"))
    }

    const vehicle = itemData[0]
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_price: vehicle.inv_price,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Delete inventory item
 * ***************************/
invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult.rowCount === 1) {
      req.flash("notice", "Inventory item successfully deleted.")
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Delete failed. Please try again.")
      res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
