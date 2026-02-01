const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const dotenv = require("dotenv").config()
const session = require("express-session")
const flash = require("connect-flash")
const pgSession = require("connect-pg-simple")(session)

const pool = require("./database/")
const utilities = require("./utilities")

const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const staticRoute = require("./routes/static")
const baseController = require("./controllers/baseController")

const app = express()

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

app.use(flash())

// Express-messages middleware (REQUIRED for CSE 340)
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* *****************************
 * Express Middleware
 * ***************************** */
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* *****************************
 * View Engine
 * ***************************** */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* *****************************
 * Routes
 * ***************************** */
app.use(staticRoute)

app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

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
