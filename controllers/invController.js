const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ***************************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  if (!data || data.length === 0) {
    return next(new Error("No vehicles found for this classification."));
  }
  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: `${className} Vehicles`,
    nav,
    grid,
  });
};

/* ***************************
 * Build inventory detail view
 * ***************************/
invCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryById(inv_id);
  const vehicle = data[0];

  if (!vehicle) {
    return next(new Error("Vehicle not found"));
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
 * ***************************/
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional server error for testing");
};

/* ***************************
 * Inventory Management view
 * ***************************/
invCont.buildManagement = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  });
};

/* ***************************
 * Add Classification views
 * ***************************/
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("notice", "Classification added successfully.");
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Failed to add classification.");
    res.redirect("/inv/add-classification");
  }
};

/* ***************************
 * Add Inventory views
 * ***************************/
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/add-inventory", {
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
  });
};

/* ***************************
 * Process Add Inventory POST
 * ***************************/
invCont.addInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const inventoryData = req.body;

  const result = await invModel.addInventory(inventoryData);

  if (result) {
    req.flash("notice", "Vehicle added successfully.");
    res.redirect("/inv");
  } else {
    const classificationSelect =
      await utilities.buildClassificationList(inventoryData.classification_id);

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      ...inventoryData, // sticky form
      errors: [{ msg: "Failed to add vehicle." }],
    });
  }
};

module.exports = invCont;
