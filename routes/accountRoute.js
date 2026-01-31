const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// GET - mostrar formulario de registro
router.get(
  "/register",
  utilities.handleErrors(accountController.showRegisterForm)
)

// POST - procesar registro (CON validación)
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// GET - mostrar formulario de login
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

module.exports = router
