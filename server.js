const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const static = require("./routes/static");
const utilities = require("./utilities");

const app = express();

// Servir toda la carpeta public
app.use(express.static("public"));

// Configuración de EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Middleware estático propio
app.use(static);

// Ruta principal
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));


// Rutas de inventario
app.use("/inv", inventoryRoute);

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

// Servidor
const port = process.env.PORT || 5500;
const host = "0.0.0.0";
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
