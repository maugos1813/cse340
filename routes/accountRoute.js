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
  utilities.checkLogin, // middleware JWT
  utilities.handleErrors(accountController.buildAccount)
)

/* ****************************************
 * UPDATE ACCOUNT (VIEW)
 **************************************** */
router.get(
  "/update/:account_id",
  utilities.checkLogin, // middleware JWT
  utilities.handleErrors(accountController.buildUpdate)
)

/* ****************************************
 * UPDATE ACCOUNT (PROCESS)
 **************************************** */
router.post(
  "/update",
  utilities.checkLogin, // middleware JWT
  regValidate.updateRules ? regValidate.updateRules() : [], // por si no existe, evitar crash
  regValidate.checkUpdateData ? regValidate.checkUpdateData : (req,res,next)=>next(),
  utilities.handleErrors(accountController.updateAccount)
)

/* ****************************************
 * UPDATE PASSWORD (PROCESS)
 **************************************** */
router.post(
  "/update-password",
  utilities.checkLogin, // middleware JWT
  regValidate.passwordRules ? regValidate.passwordRules() : [],
  regValidate.checkPassword ? regValidate.checkPassword : (req,res,next)=>next(),
  utilities.handleErrors(accountController.updatePassword)
)

/* ****************************************
 * LOGOUT
 **************************************** */
router.get(
  "/logout",
  utilities.handleErrors(accountController.logout)
)

module.exports = router
