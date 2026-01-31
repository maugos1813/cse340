const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")


/* ****************************************
 *  Deliver login view
 * **************************************** */
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice"),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Deliver registration view
 * **************************************** */
async function showRegisterForm(req, res, next) {
    try {
      const nav = await utilities.getNav()
      res.render("account/register", {
        title: "Register",
        nav,
        notice: req.flash("notice"),
        errors: null,               // Inicializamos errores
        account_firstname: "",      // Inicializamos campos "sticky"
        account_lastname: "",
        account_email: "",
      })
    } catch (error) {
      next(error)
    }
  }
  

/* ****************************************
 *  Process registration
 * **************************************** */
async function registerAccount(req, res, next) {
    try {
      const nav = await utilities.getNav()
      const {
        account_firstname,
        account_lastname,
        account_email,
        account_password,
      } = req.body
  
      // ===============================
      // Hash the password before storing
      // ===============================
      let hashedPassword
      try {
        // hashSync genera un hash de la contraseña; 10 es el saltRounds
        hashedPassword = await bcrypt.hashSync(account_password, 10)
      } catch (error) {
        req.flash(
          "notice",
          'Sorry, there was an error processing the registration.'
        )
        return res.status(500).render("account/register", {
          title: "Register",
          nav,
          errors: null,
          account_firstname,
          account_lastname,
          account_email,
          notice: req.flash("notice"),
        })
      }
  
      // ===============================
      // Registrar cuenta usando hashedPassword
      // ===============================
      const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
      )
  
      if (regResult) {
        req.flash(
          "notice",
          `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
          title: "Login",
          nav,
          notice: req.flash("notice"),
          errors: null,
        })
      } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(500).render("account/register", {
          title: "Register",
          nav,
          notice: req.flash("notice"),
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
  

module.exports = {
  buildLogin,
  showRegisterForm,
  registerAccount,
}
