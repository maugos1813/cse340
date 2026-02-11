const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const dotenv = require("dotenv").config()
const session = require("express-session")
const flash = require("connect-flash")
const pgSession = require("connect-pg-simple")(session)
const cookieParser = require("cookie-parser")

const pool = require("./database/")
const utilities = require("./utilities")

const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const staticRoute = require("./routes/static")
const baseController = require("./controllers/baseController")

const favoriteRoute = require("./routes/favoriteRoute")

const app = express()

/* *****************************
 * BODY PARSERS (DEBEN IR PRIMERO)
 * ***************************** */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* *****************************
 * Static Files
 * ***************************** */
app.use(express.static("public"))

/* *****************************
 * Session & Flash Middleware
 * ***************************** */
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
)

app.use(cookieParser())
app.use(flash())

// Express-messages (REQUIRED for CSE 340)
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* *****************************
 * View Engine
 * ***************************** */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* *****************************
 * JWT Middleware
 * Must run BEFORE protected routes
 * ***************************** */
app.use(utilities.checkJWTToken)

// Ensure accountData always exists for views
app.use((req, res, next) => {
  if (!res.locals.accountData) {
    res.locals.accountData = {}
  }
  next()
})

/* *****************************
 * PUBLIC ROUTES (NO LOGIN REQUIRED)
 * ***************************** */
app.use(staticRoute)             // static pages
app.use("/account", accountRoute) // login/register/logout
app.get("/", utilities.handleErrors(baseController.buildHome))

/* *****************************
 * INVENTORY ROUTES
 * Some routes protected inside inventoryRoute
 * ***************************** */
app.use("/inv", inventoryRoute)

app.use("/favorites", favoriteRoute)


/* *****************************
 * 404 Handler
 * ***************************** */
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  })
})

/* *****************************
 * Error Handler
 * ***************************** */
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  })
})


/* *****************************
 * Server
 * ***************************** */
const port = process.env.PORT || 5500
const host = "0.0.0.0"

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})
