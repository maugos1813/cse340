const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const static = require("./routes/static");
const utilities = require("./utilities");
const session = require("express-session");
const pool = require("./database/");
const accountRoute = require("./routes/accountRoute");

const app = express();

/* ***********************
 * Middleware de sesión y flash
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* ***********************
 * Middleware de Express
 * ************************/
// Servir toda la carpeta public
app.use(express.static("public"));
// Middleware para parsear datos del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Middleware estático propio
app.use(static);

// Configuración de EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Rutas
 * ************************/
// Ruta principal
app.get("/", utilities.handleErrors(baseController.buildHome));

// Rutas de inventario
app.use("/inv", inventoryRoute);

// Rutas de cuenta
app.use("/account", accountRoute);

/* ***********************
 * Manejo de errores
 * ************************/
// Middleware 404 - para rutas no encontradas
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// Express Error Handler - debe ir después de todo lo demás
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});

/* ***********************
 * Servidor
 * ************************/
const port = process.env.PORT || 5500;
const host = "0.0.0.0";
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
