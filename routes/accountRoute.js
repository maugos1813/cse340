const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

/* ****************************************
 * REGISTER
 **************************************** */
router.get(
  "/register",
  utilities.handleErrors(accountController.showRegisterForm)
)

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ****************************************
 * LOGIN
 **************************************** */
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ****************************************
 * ACCOUNT DASHBOARD (PROTECTED)
 **************************************** */
router.get(
  "/",
  utilities.checkLogin, // Middleware asegura que el usuario esté logueado
  utilities.handleErrors(accountController.buildAccount)
)

/* ****************************************
 * LOGOUT
 **************************************** */
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")       // Borra JWT
  req.session.destroy()        // Destruye sesión
  req.flash("notice", "You have successfully logged out.")
  res.redirect("/")            // Redirige al home
})

module.exports = router
