const express = require("express")
const router = express.Router()

const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities")

/* Add favorite */
router.post(
  "/add",
  utilities.checkLogin,
  favoriteController.addFavorite
)

/* Remove favorite */
router.post(
  "/remove",
  utilities.checkLogin,
  favoriteController.removeFavorite
)

/* View favorites */
router.get(
  "/",
  utilities.checkLogin,
  favoriteController.buildFavoritesView
)

module.exports = router
