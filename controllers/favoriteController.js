const favoriteModel = require("../models/favorite-model")
const utilities = require("../utilities")

/* ***************************
 * Add Favorite
 *************************** */
async function addFavorite(req, res) {
  try {
    const { inv_id } = req.body
    const accountData = res.locals.accountData

    if (!accountData || !accountData.account_id) {
      req.flash("notice", "You must be logged in to add favorites.")
      return res.redirect("/account/login")
    }

    if (!inv_id) {
      req.flash("notice", "Invalid vehicle.")
      return res.redirect("/")
    }

    await favoriteModel.addFavorite(accountData.account_id, inv_id)

    req.flash("notice", "Vehicle added to favorites.")
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    console.error("Add Favorite Error:", error)
    req.flash("notice", "Error adding favorite.")
    res.redirect("/")
  }
}

/* ***************************
 * Remove Favorite
 *************************** */
async function removeFavorite(req, res) {
  try {
    const { inv_id } = req.body
    const accountData = res.locals.accountData

    if (!accountData || !accountData.account_id) {
      req.flash("notice", "You must be logged in to remove favorites.")
      return res.redirect("/account/login")
    }

    await favoriteModel.removeFavorite(accountData.account_id, inv_id)

    req.flash("notice", "Vehicle removed from favorites.")
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    console.error("Remove Favorite Error:", error)
    req.flash("notice", "Error removing favorite.")
    res.redirect("/")
  }
}

/* ***************************
 * Build Favorites View
 *************************** */
async function buildFavoritesView(req, res, next) {
  try {
    const accountData = res.locals.accountData

    if (!accountData || !accountData.account_id) {
      req.flash("notice", "You must be logged in to view favorites.")
      return res.redirect("/account/login")
    }

    const data = await favoriteModel.getFavoritesByAccount(accountData.account_id)

    // Construye la navegación
    const nav = await utilities.getNav()

    res.render("favorites/index", {
      title: "My Favorites",
      favorites: data.rows,  // data.rows desde el modelo
      nav,                    // <--- enviamos nav a la vista
    })
  } catch (error) {
    console.error("Favorites View Error:", error)
    req.flash("notice", "Error loading favorites.")
    res.redirect("/")
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  buildFavoritesView,
}
