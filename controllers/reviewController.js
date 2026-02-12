const reviewModel = require("../models/review-model")

/* ***************************
 * Add Review Controller
 * ************************** */
async function addReview(req, res) {
  try {
    let { inv_id, review_text, review_rating } = req.body

    // Convert to numbers
    inv_id = parseInt(inv_id)
    review_rating = parseInt(review_rating)

    // Validate login via JWT
    const account_id = res.locals.accountData.account_id
    if (!account_id) {
      req.flash("notice", "You must be logged in.")
      return res.redirect("/account/login")
    }

    // Validate review text
    if (!review_text || review_text.trim().length === 0) {
      req.flash("notice", "Review text cannot be empty.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    // Validate rating
    if (isNaN(review_rating) || review_rating < 1 || review_rating > 5) {
      req.flash("notice", "Rating must be between 1 and 5.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    // Insert review
    const result = await reviewModel.addReview(
      inv_id,
      account_id,
      review_text.trim(),
      review_rating
    )

    if (!result) {
      req.flash("notice", "Sorry, the review could not be added.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    req.flash("notice", "Review successfully added.")
    return res.redirect(`/inv/detail/${inv_id}`)

  } catch (error) {
    console.error("Controller addReview error:", error)
    req.flash("notice", "A server error occurred.")
    return res.redirect("/")
  }
}

module.exports = {
  addReview
}
