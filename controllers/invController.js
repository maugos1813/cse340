const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}

/* Build inventory by classification view */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
}

/* ***************************
 * Build inventory detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id;

  const data = await invModel.getInventoryById(inv_id);
  const vehicle = data[0];

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const vehicleHTML = await utilities.buildVehicleDetail(vehicle);
  const nav = await utilities.getNav();

  res.render("./inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicleHTML,
  });
};

/* ***************************
 * Intentional error trigger
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional server error for testing");
};


module.exports = invCont;
