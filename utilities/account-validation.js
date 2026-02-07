const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => [
  body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a first name."),
  body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a last name."),
  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists) {
        throw new Error("Email exists. Please log in or use a different email.")
      }
    }),
  body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 12 characters and include 1 uppercase letter, 1 number, and 1 special character."
    ),
]

/* ******************************
 * Check registration data
 ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      notice: req.flash("notice"),
    })
    return
  }
  next()
}

/* **********************************
 * Login Data Validation Rules
 ********************************* */
validate.loginRules = () => [
  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required."),
  body("account_password")
    .trim()
    .notEmpty()
    .withMessage("Password is required."),
]

/* ******************************
 * Check login data
 ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
      notice: req.flash("notice"),
    })
    return
  }
  next()
}

/* **********************************
 * Account Update Validation Rules
 ********************************* */
validate.updateRules = () => [
  body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a first name."),
  body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a last name."),
  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (value, { req }) => {
      const account_id = req.body.account_id
      const account = await accountModel.getAccountByEmail(value)
      if (account && account.account_id != account_id) {
        throw new Error("Email already in use by another account.")
      }
    }),
]

validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const accountData = { account_id, account_firstname, account_lastname, account_email }
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors,
      notice: req.flash("notice"),
      accountData,
    })
    return
  }
  next()
}

/* **********************************
 * Password Change Validation Rules
 ********************************* */
validate.passwordRules = () => [
  body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 12 characters and include 1 uppercase letter, 1 number, and 1 special character."
    ),
]

validate.checkPassword = async (req, res, next) => {
  const { account_id } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors,
      notice: req.flash("notice"),
      accountData,
    })
    return
  }
  next()
}

module.exports = validate
