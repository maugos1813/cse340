const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// Ruta GET para mostrar el login
router.get("/login", accountController.buildLogin, (err, req, res, next) => {
  next(err)
})

module.exports = router
