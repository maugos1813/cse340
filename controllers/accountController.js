const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Mostrar login
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice"),
      errors: null,
      account_email: "",
    })
  } catch (error) {
    next(error)
  }
}

// Procesar login
async function accountLogin(req, res, next) {
  try {
    const { account_email, account_password } = req.body
    const nav = await utilities.getNav()

    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600,
      })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/") // Aquí rediriges al home
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    next(error)
  }
}

// Mostrar registro
async function showRegisterForm(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      notice: req.flash("notice"),
      errors: null,
      account_firstname: "",
      account_lastname: "",
      account_email: "",
    })
  } catch (error) {
    next(error)
  }
}

// Procesar registro
async function registerAccount(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const nav = await utilities.getNav()
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", `Congratulations ${account_firstname}, please log in.`)
      return res.redirect("/account/login")
    } else {
      req.flash("notice", "Sorry, registration failed.")
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (error) {
    next(error)
  }
}

// Mostrar panel de cuenta
async function buildAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/index", {
      title: "Account",
      nav,
      notice: req.flash("notice"),
      errors: null,
      accountData: res.locals.accountData || {},
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildLogin,
  accountLogin,
  showRegisterForm,
  registerAccount,
  buildAccount,
}
