const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 * LOGIN
 **************************************** */
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
      return res.redirect("/account") // Redirige al panel de cuenta
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

/* ****************************************
 * REGISTER
 **************************************** */
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

/* ****************************************
 * ACCOUNT DASHBOARD / MANAGEMENT VIEW
 **************************************** */
async function buildAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/management", { // Ahora apunta al management.ejs
      title: "Account Management",
      nav,
      notice: req.flash("notice"),
      errors: null,
      accountData: res.locals.accountData || {},
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * BUILD UPDATE VIEW
 **************************************** */
async function buildUpdate(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const account_id = req.params.account_id
    const accountData = await accountModel.getAccountById(account_id)

    if (!accountData) {
      req.flash("notice", "Account not found.")
      return res.redirect("/account")
    }

    res.render("account/update", {
      title: "Update Account Information",
      nav,
      notice: req.flash("notice"),
      errors: null,
      accountData,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * PROCESS ACCOUNT UPDATE
 **************************************** */
async function updateAccount(req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const nav = await utilities.getNav()

    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (!updateResult) {
      req.flash("notice", "Failed to update account information.")
      const accountData = await accountModel.getAccountById(account_id)
      return res.render("account/update", {
        title: "Update Account Information",
        nav,
        notice: req.flash("notice"),
        errors: null,
        accountData,
      })
    }

    req.flash("notice", "Account information updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      notice: req.flash("notice"),
      errors: null,
      accountData,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * PROCESS PASSWORD CHANGE
 **************************************** */
async function updatePassword(req, res, next) {
  try {
    const { account_id, account_password } = req.body
    const nav = await utilities.getNav()

    if (!account_password) {
      req.flash("notice", "Password cannot be empty.")
      const accountData = await accountModel.getAccountById(account_id)
      return res.render("account/update", {
        title: "Update Account Information",
        nav,
        notice: req.flash("notice"),
        errors: null,
        accountData,
      })
    }

    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)

    if (!result) {
      req.flash("notice", "Failed to update password.")
      const accountData = await accountModel.getAccountById(account_id)
      return res.render("account/update", {
        title: "Update Account Information",
        nav,
        notice: req.flash("notice"),
        errors: null,
        accountData,
      })
    }

    req.flash("notice", "Password updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      notice: req.flash("notice"),
      errors: null,
      accountData,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * LOGOUT
 **************************************** */
async function logout(req, res, next) {
  try {
    // Limpiamos la cookie JWT
    res.clearCookie("jwt")

    // Destruye la sesión si existe, pero no detiene el logout si no hay sesión
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err)
        }
        // Redirige al login
        res.redirect("/account/login")
      })
    } else {
      // Si no hay sesión, simplemente redirige
      res.redirect("/account/login")
    }
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
  buildUpdate,
  updateAccount,
  updatePassword,
  logout,
}
