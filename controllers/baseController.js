const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()

  res.render("index", {title: "Home", nav})
}

baseController.addItem = async function(req, res) {
  // lógica para agregar item...
  req.flash("success", "Item agregado correctamente")
  res.redirect("/")
}

module.exports = baseController